import { UserConnection } from '../../object-types'
import { ConnectionArgs } from '../../input-types'
import { ErrorCode } from '../../types'
import { User } from '../../entities'
import { getRepository } from 'typeorm'
import moment from 'moment'

export const getUserPaginated = async (
  options: ConnectionArgs,
  user?: User
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

  const adminRole = await user.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
  })

  if (!adminRole || !userSettings || !userSettings.canShowList) {
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

  // Preparing object
  const connection = new UserConnection()
  const qb = getRepository(User)
    .createQueryBuilder('user')
    .where(`LOWER(user.email) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })

  if (before) {
    qb.andWhere('user.createdAt < :before', { before })
      .orderBy('user.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('user.createdAt > :after', { after })
      .orderBy('user.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('user.email', 'ASC').limit(options.first)
  }

  const categories = await qb.getMany()

  if (before) {
    categories.reverse()
  }

  const firstUser = categories[0]
  const lastUser = categories[categories.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstUser?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastUser?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  const previousCategories = await getRepository(User)
    .createQueryBuilder('user')
    .where(`LOWER(user.email) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('user.createdAt < :minDate', { minDate })
    .getMany()

  const nextCategories = await getRepository(User)
    .createQueryBuilder('user')
    .where(`LOWER(user.email) like :query`, {
      query: `%${options.query.toLowerCase()}%`,
    })
    .andWhere('user.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.edges = categories.map((user) => ({
    node: user,
    cursor: Buffer.from(moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstUser?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastUser?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextCategories.length,
    hasPreviousPage: !!previousCategories.length,
  }

  return connection
}
