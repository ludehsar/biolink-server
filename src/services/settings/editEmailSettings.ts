import { validate } from 'class-validator'
import { EmailSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { EmailSettingsInput } from '../../input-types'
import { EmailSystemSettings } from '../../json-types'

export const editEmailSettings = async (
  options: EmailSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<EmailSettingsResponse> => {
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

  if (!adminRole || adminRole.roleName !== 'Administrator') {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  let email = await Settings.findOne({ where: { key: 'email' } })

  if (!email) {
    email = await Settings.create({
      key: 'email',
    }).save()
  }

  const emailSettings = (email.value || {}) as EmailSystemSettings

  emailSettings.fromEmail = options.fromEmail || ''
  emailSettings.fromName = options.fromName || ''

  email.value = emailSettings
  await email.save()

  await captureUserActivity(adminUser, context, `Changed email settings`, true)

  return { settings: emailSettings }
}
