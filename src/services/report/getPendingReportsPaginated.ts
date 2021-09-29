import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { AdminRole, Report, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { ReportConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { ResolveStatus } from '../../enums'
import { captureUserActivity } from '../../services'

export const getPendingReportsPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<ReportConnection> => {
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
    return role.resource === 'report'
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
  const connection = new ReportConnection()

  const qb = getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.reporter', 'user')
    .where(`report.status = '${ResolveStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(report.firstName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(report.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.reportedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('report.createdAt < :before', { before })
      .orderBy('report.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('report.createdAt > :after', { after })
      .orderBy('report.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('report.createdAt', 'ASC').limit(options.first)
  }

  const reports = await qb.getMany()

  if (before) {
    reports.reverse()
  }

  const firstReport = reports[0]
  const lastReport = reports[reports.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstReport?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastReport?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = reports.map((report) => ({
    node: report,
    cursor: Buffer.from(moment(report.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousReports = await getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.reporter', 'user')
    .where(`report.status = '${ResolveStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(report.firstName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(report.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.reportedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('report.createdAt < :minDate', { minDate })
    .getMany()

  const nextReports = await getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.reporter', 'user')
    .where(`report.status = '${ResolveStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(report.firstName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(report.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(report.reportedUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('report.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstReport?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastReport?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextReports.length,
    hasPreviousPage: !!previousReports.length,
  }

  await captureUserActivity(adminUser, context, `Requested pending reports`, false)

  return connection
}
