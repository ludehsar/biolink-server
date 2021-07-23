import { FacebookSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { FacebookSettingsInput } from '../../input-types'
import { FacebookSystemSettings } from '../../json-types'

export const editFacebookSettings = async (
  options: FacebookSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<FacebookSettingsResponse> => {
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

  let facebook = await Settings.findOne({ where: { key: 'facebook' } })

  if (!facebook) {
    facebook = await Settings.create({
      key: 'facebook',
    }).save()
  }

  const facebookSettings = (facebook.value || {}) as FacebookSystemSettings

  facebookSettings.enableFacebookLogin = options.enableFacebookLogin || false

  facebook.value = facebookSettings
  await facebook.save()

  await captureUserActivity(adminUser, context, `Changed facebook settings`, true)

  return { settings: facebookSettings }
}
