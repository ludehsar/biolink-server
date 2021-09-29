import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { AdminRole, Support, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { SupportConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { ResolveStatus } from '../../enums'
import { captureUserActivity } from '../../services'

export const getResolvedSupportsPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<SupportConnection> => {
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
    return role.resource === 'support'
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
  const connection = new SupportConnection()

  const qb = getRepository(Support)
    .createQueryBuilder('support')
    .leftJoinAndSelect('support.user', 'user')
    .where(`support.status = '${ResolveStatus.Resolved}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(support.fullName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(support.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.phoneNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.company) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.subject) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.message) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('support.createdAt < :before', { before })
      .orderBy('support.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('support.createdAt > :after', { after })
      .orderBy('support.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('support.createdAt', 'ASC').limit(options.first)
  }

  const supports = await qb.getMany()

  if (before) {
    supports.reverse()
  }

  const firstSupport = supports[0]
  const lastSupport = supports[supports.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstSupport?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastSupport?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = supports.map((support) => ({
    node: support,
    cursor: Buffer.from(moment(support.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousSupports = await getRepository(Support)
    .createQueryBuilder('support')
    .leftJoinAndSelect('support.user', 'user')
    .where(`support.status = '${ResolveStatus.Resolved}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(support.fullName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(support.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.phoneNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.company) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.subject) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.message) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('support.createdAt < :minDate', { minDate })
    .getMany()

  const nextSupports = await getRepository(Support)
    .createQueryBuilder('support')
    .leftJoinAndSelect('support.user', 'user')
    .where(`support.status = '${ResolveStatus.Resolved}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(support.fullName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(support.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.phoneNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.company) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.subject) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(support.message) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('support.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstSupport?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastSupport?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextSupports.length,
    hasPreviousPage: !!previousSupports.length,
  }

  await captureUserActivity(adminUser, context, `Requested resolved supports`, false)

  return connection
}
