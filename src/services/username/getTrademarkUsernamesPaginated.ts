import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Username, User, AdminRole } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { UsernameConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { PremiumUsernameType } from '../../enums'
import { captureUserActivity } from '../../services'

export const getTrademarkUsernamesPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<UsernameConnection> => {
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
    return role.resource === 'username'
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
  const connection = new UsernameConnection()

  const qb = getRepository(Username)
    .createQueryBuilder('username')
    .leftJoinAndSelect('username.owner', 'user')
    .where(`username.premiumType = '${PremiumUsernameType.Trademark}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )

  if (before) {
    qb.andWhere('username.createdAt < :before', { before })
      .orderBy('username.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('username.createdAt > :after', { after })
      .orderBy('username.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('username.createdAt', 'ASC').limit(options.first)
  }

  const usernames = await qb.getMany()

  if (before) {
    usernames.reverse()
  }

  const firstUsername = usernames[0]
  const lastUsername = usernames[usernames.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstUsername?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastUsername?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = usernames.map((username) => ({
    node: username,
    cursor: Buffer.from(moment(username.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  const previousUsernames = await getRepository(Username)
    .createQueryBuilder('username')
    .leftJoinAndSelect('username.owner', 'user')
    .where(`username.premiumType = '${PremiumUsernameType.Trademark}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )
    .andWhere('username.createdAt < :minDate', { minDate })
    .getMany()

  const nextUsernames = await getRepository(Username)
    .createQueryBuilder('username')
    .leftJoinAndSelect('username.owner', 'user')
    .where(`username.premiumType = '${PremiumUsernameType.Trademark}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(username.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )
    .andWhere('username.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstUsername?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastUsername?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextUsernames.length,
    hasPreviousPage: !!previousUsernames.length,
  }

  await captureUserActivity(adminUser, context, `Requested trademark usernames`, false)

  return connection
}
