import { validate } from 'class-validator'
import { ErrorCode, MyContext } from '../../types'
import { NewReportInput } from '../../input-types'
import { DefaultResponse } from 'object-types'
import { Report, User } from '../../entities'
import { captureUserActivity } from '../../services'
import { isMalicious } from '../../utilities'

export const addReport = async (
  options: NewReportInput,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  if (options.reportedUrl && isMalicious([options.reportedUrl])) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_IS_MALICIOUS,
          message: 'Malicious links detected',
        },
      ],
    }
  }

  const report = Report.create({
    description: options.description,
    email: options.email,
    firstName: options.firstName,
    lastName: options.lastName,
    reportedUrl: options.reportedUrl,
  })

  if (user) {
    report.reporter = Promise.resolve(user)
  }

  await report.save()

  if (user) {
    await captureUserActivity(user, context, `Reported ${options.reportedUrl}`, true)
  }

  return {}
}
