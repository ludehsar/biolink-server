import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Tax, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { TaxConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getTaxesPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<TaxConnection> => {
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
    return role.resource === 'tax'
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
  const connection = new TaxConnection()

  const qb = getRepository(Tax)
    .createQueryBuilder('tax')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(tax.internalName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(tax.name) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("tax"."value"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.countries) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('tax.createdAt < :before', { before })
      .orderBy('tax.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('tax.createdAt > :after', { after })
      .orderBy('tax.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('tax.createdAt', 'ASC').limit(options.first)
  }

  const taxs = await qb.getMany()

  if (before) {
    taxs.reverse()
  }

  const firstTax = taxs[0]
  const lastTax = taxs[taxs.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstTax?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastTax?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = taxs.map((tax) => ({
    node: tax,
    cursor: Buffer.from(moment(tax.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousTaxs = await getRepository(Tax)
    .createQueryBuilder('tax')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(tax.internalName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(tax.name) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("tax"."value"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.countries) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('tax.createdAt < :minDate', { minDate })
    .getMany()

  const nextTaxs = await getRepository(Tax)
    .createQueryBuilder('tax')
    .where(
      new Brackets((qb) => {
        qb.where(`LOWER(tax.internalName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(tax.name) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER("tax"."value"::text) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.countries) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('tax.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstTax?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(moment(lastTax?.createdAt).format('YYYY-MM-DD HH:mm:ss') || '').toString(
      'base64'
    ),
    hasNextPage: !!nextTaxs.length,
    hasPreviousPage: !!previousTaxs.length,
  }

  await captureUserActivity(adminUser, context, `Requested taxes list`, false)

  return connection
}
