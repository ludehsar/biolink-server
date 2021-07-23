import { EmailSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { EmailSystemSettings } from '../../json-types'

export const getEmailSettings = async (
  adminUser: User,
  context: MyContext
): Promise<EmailSettingsResponse> => {
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

  const emailSettings = email.value as EmailSystemSettings

  await captureUserActivity(adminUser, context, `Requested email settings`, false)

  return { settings: emailSettings }
}
