import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Code, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { CodeConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { CodeType } from '../../enums'
import { captureUserActivity } from '../../services'

export const getReferralCodesPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<CodeConnection> => {
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
    return role.resource === 'code'
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
  const connection = new CodeConnection()

  const qb = getRepository(Code)
    .createQueryBuilder('code')
    .leftJoinAndSelect('code.referrer', 'user')
    .where(`code.type = '${CodeType.Referral}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(code.code) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("code"."discount"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."quantity"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."expireDate"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('code.createdAt < :before', { before })
      .orderBy('code.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('code.createdAt > :after', { after })
      .orderBy('code.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('code.createdAt', 'ASC').limit(options.first)
  }

  const codes = await qb.getMany()

  if (before) {
    codes.reverse()
  }

  const firstCode = codes[0]
  const lastCode = codes[codes.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstCode?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastCode?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = codes.map((code) => ({
    node: code,
    cursor: Buffer.from(moment(code.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousCodes = await getRepository(Code)
    .createQueryBuilder('code')
    .leftJoinAndSelect('code.referrer', 'user')
    .where(`code.type = '${CodeType.Referral}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(code.code) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("code"."discount"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."quantity"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."expireDate"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('code.createdAt < :minDate', { minDate })
    .getMany()

  const nextCodes = await getRepository(Code)
    .createQueryBuilder('code')
    .leftJoinAndSelect('code.referrer', 'user')
    .where(`code.type = '${CodeType.Referral}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(code.code) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER("code"."discount"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."quantity"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("code"."expireDate"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('code.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstCode?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastCode?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextCodes.length,
    hasPreviousPage: !!previousCodes.length,
  }

  await captureUserActivity(adminUser, context, `Requested referral codes`, false)

  return connection
}
