import { MainSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { MainSystemSettings } from '../../json-types'

export const getMainSettings = async (
  adminUser: User,
  context: MyContext
): Promise<MainSettingsResponse> => {
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

  let main = await Settings.findOne({ where: { key: 'main' } })

  if (!main) {
    main = await Settings.create({
      key: 'main',
    }).save()
  }

  const mainSettings = main.value as MainSystemSettings

  await captureUserActivity(adminUser, context, `Requested main settings`, false)

  return { settings: mainSettings }
}
