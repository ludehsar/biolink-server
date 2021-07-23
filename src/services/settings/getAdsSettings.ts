import { AdsSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { AdsSystemSettings } from '../../json-types'

export const getAdsSettings = async (
  adminUser: User,
  context: MyContext
): Promise<AdsSettingsResponse> => {
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

  let ads = await Settings.findOne({ where: { key: 'ads' } })

  if (!ads) {
    ads = await Settings.create({
      key: 'ads',
    }).save()
  }

  const adsSettings = ads.value as AdsSystemSettings

  await captureUserActivity(adminUser, context, `Requested ads settings`, false)

  return { settings: adsSettings }
}
