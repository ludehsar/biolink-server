import { AdsSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { AdsSettingsInput } from '../../input-types'
import { AdsSystemSettings } from '../../json-types'

export const editAdsSettings = async (
  options: AdsSettingsInput,
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

  const adsSettings = (ads.value || {}) as AdsSystemSettings

  adsSettings.biolinkPageFooter = options.biolinkPageFooter || ''
  adsSettings.biolinkPageHeader = options.biolinkPageHeader || ''
  adsSettings.footer = options.footer || ''
  adsSettings.header = options.header || ''

  ads.value = adsSettings
  await ads.save()

  await captureUserActivity(adminUser, context, `Changed ads settings`, true)

  return { settings: adsSettings }
}
