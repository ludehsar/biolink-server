import { MailDataRequired } from '@sendgrid/mail'
import { ReportResponse } from '../../object-types'
import { AdminRole, Report, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { ReportStatusInput } from '../../input-types'
import { ResolveStatus } from '../../enums'
import { sgMail } from '../../utilities'

export const changeReportStatus = async (
  reportId: string,
  options: ReportStatusInput,
  adminUser: User,
  context: MyContext
): Promise<ReportResponse> => {
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

  const report = await Report.findOne(reportId)

  if (!report) {
    return {
      errors: [
        {
          errorCode: ErrorCode.REPORT_NOT_FOUND,
          message: 'Report not found',
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
    (!adminRole || !userSettings || !userSettings.canEdit) &&
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

  report.status = options.status || ResolveStatus.Pending
  await report.save()

  const reportReplyMailData: MailDataRequired = {
    to: {
      email: report.email,
    },
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Thanks for Reporting`,
    html: `We have reviewed your report.`,
  }

  await sgMail.send(reportReplyMailData, false)

  await captureUserActivity(
    adminUser,
    context,
    `Changed report status of ${report.id} to ${report.status}`,
    true
  )

  return { report }
}
