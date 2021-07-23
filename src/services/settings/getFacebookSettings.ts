import { FacebookSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { FacebookSystemSettings } from '../../json-types'

export const getFacebookSettings = async (
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

  const facebookSettings = facebook.value as FacebookSystemSettings

  await captureUserActivity(adminUser, context, `Requested facebook settings`, false)

  return { settings: facebookSettings }
}
