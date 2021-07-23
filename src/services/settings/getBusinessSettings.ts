import { BusinessSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { BusinessSystemSettings } from '../../json-types'

export const getBusinessSettings = async (
  adminUser: User,
  context: MyContext
): Promise<BusinessSettingsResponse> => {
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

  let business = await Settings.findOne({ where: { key: 'business' } })

  if (!business) {
    business = await Settings.create({
      key: 'business',
    }).save()
  }

  const businessSettings = business.value as BusinessSystemSettings

  await captureUserActivity(adminUser, context, `Requested business settings`, false)

  return { settings: businessSettings }
}
