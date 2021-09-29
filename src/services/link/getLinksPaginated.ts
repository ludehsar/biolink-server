import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { AdminRole, Link, User } from '../../entities'
import { ConnectionArgsOld } from '../../input-types'
import { LinkConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { LinkType } from '../../enums'
import { captureUserActivity } from '../../services'

export const getLinksPaginated = async (
  options: ConnectionArgsOld,
  adminUser: User,
  context: MyContext
): Promise<LinkConnection> => {
  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'link'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShowList) &&
    adminRole.roleName !== 'Administrator'
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new LinkConnection()

  const qb = getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where(`link.linkType = '${LinkType.Link}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(link.linkTitle) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(link.url) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.shortenedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.note) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('link.createdAt < :before', { before })
      .orderBy('link.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('link.createdAt > :after', { after })
      .orderBy('link.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('link.createdAt', 'ASC').limit(options.first)
  }

  const links = await qb.getMany()

  if (before) {
    links.reverse()
  }

  const firstLink = links[0]
  const lastLink = links[links.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstLink?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastLink?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = links.map((link) => ({
    node: link,
    cursor: Buffer.from(moment(link.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousLinks = await getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where(`link.linkType = '${LinkType.Link}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(link.linkTitle) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(link.url) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.shortenedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.note) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('link.createdAt < :minDate', { minDate })
    .getMany()

  const nextLinks = await getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'user')
    .where(`link.linkType = '${LinkType.Link}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(link.linkTitle) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(link.url) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.shortenedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(link.note) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('link.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstLink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastLink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextLinks.length,
    hasPreviousPage: !!previousLinks.length,
  }

  await captureUserActivity(adminUser, context, `Requested referral codes`, false)

  return connection
}
