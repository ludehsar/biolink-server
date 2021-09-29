import { UserConnection } from '../../object-types'
import { ConnectionArgsOld } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { AdminRole, User } from '../../entities'
import { Brackets, getRepository } from 'typeorm'
import moment from 'moment'
import { captureUserActivity } from '../../services'

export const getUsersPaginated = async (
  options: ConnectionArgsOld,
  user: User,
  context: MyContext
): Promise<UserConnection> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = (await user.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
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
  const connection = new UserConnection()

  const qb = getRepository(User)
    .createQueryBuilder('user')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("user"."billing"->>'name') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address1') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address2') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'city') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'state') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'country') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'zip') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'phone') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.lastIPAddress) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('user.createdAt < :before', { before })
      .orderBy('user.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('user.createdAt > :after', { after })
      .orderBy('user.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('user.createdAt', 'ASC').limit(options.first)
  }

  const users = await qb.getMany()

  if (before) {
    users.reverse()
  }

  const firstUser = users[0]
  const lastUser = users[users.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstUser?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastUser?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = users.map((user) => ({
    node: user,
    cursor: Buffer.from(moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousUsers = await getRepository(User)
    .createQueryBuilder('user')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("user"."billing"->>'name') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address1') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address2') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'city') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'state') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'country') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'zip') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'phone') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.lastIPAddress) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('user.createdAt < :minDate', { minDate })
    .getMany()

  const nextUsers = await getRepository(User)
    .createQueryBuilder('user')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(user.email) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("user"."billing"->>'name') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address1') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'address2') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'city') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'state') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'country') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'zip') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("user"."billing"->>'phone') like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.lastIPAddress) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('user.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstUser?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastUser?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextUsers.length,
    hasPreviousPage: !!previousUsers.length,
  }

  await captureUserActivity(user, context, `Requested all users`, false)

  return connection
}
