import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { BlackList, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { BlackListConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { BlacklistType } from '../../enums'
import { captureUserActivity } from '../../services'

export const getBlackListedBadWordsPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<BlackListConnection> => {
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

  const adminRole = await adminUser.adminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'black_list'
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
  const connection = new BlackListConnection()

  const qb = getRepository(BlackList)
    .createQueryBuilder('blackList')
    .where(`blackList.blacklistType = '${BlacklistType.BadWord}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(blackList.keyword) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(blackList.reason) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )

  if (before) {
    qb.andWhere('blackList.createdAt < :before', { before })
      .orderBy('blackList.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('blackList.createdAt > :after', { after })
      .orderBy('blackList.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('blackList.createdAt', 'ASC').limit(options.first)
  }

  const blackLists = await qb.getMany()

  if (before) {
    blackLists.reverse()
  }

  const firstBlackList = blackLists[0]
  const lastBlackList = blackLists[blackLists.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstBlackList?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastBlackList?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = blackLists.map((blackList) => ({
    node: blackList,
    cursor: Buffer.from(moment(blackList.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  const previousBlackLists = await getRepository(BlackList)
    .createQueryBuilder('blackList')
    .where(`blackList.blacklistType = '${BlacklistType.BadWord}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(blackList.keyword) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(blackList.reason) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )
    .andWhere('blackList.createdAt < :minDate', { minDate })
    .getMany()

  const nextBlackLists = await getRepository(BlackList)
    .createQueryBuilder('blackList')
    .where(`blackList.blacklistType = '${BlacklistType.BadWord}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(blackList.keyword) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(blackList.reason) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )
    .andWhere('blackList.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstBlackList?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastBlackList?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextBlackLists.length,
    hasPreviousPage: !!previousBlackLists.length,
  }

  await captureUserActivity(adminUser, context, `Requested blacklisted bad words`, false)

  return connection
}
