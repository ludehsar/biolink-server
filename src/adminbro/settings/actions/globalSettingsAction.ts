import { ApiClient, BaseRecord } from 'admin-bro'

import { MainSystemSettings } from '../../../models/jsonTypes/MainSystemSettings'
import { AdsSystemSettings } from '../../../models/jsonTypes/AdsSystemSettings'
import { BusinessSystemSettings } from '../../../models/jsonTypes/BusinessSystemSettings'
import { CaptchaSystemSettings } from '../../../models/jsonTypes/CaptchaSystemSettings'
import { EmailSystemSettings } from '../../../models/jsonTypes/EmailSystemSettings'
import { FacebookSystemSettings } from '../../../models/jsonTypes/FacebookSystemSettings'
import { LinkSystemSettings } from '../../../models/jsonTypes/LinkSystemSettings'
import { NotificationSystemSettings } from '../../../models/jsonTypes/NotificationSystemSettings'
import { PaymentSystemSettings } from '../../../models/jsonTypes/PaymentSystemSettings'
import { SocialSystemSettings } from '../../../models/jsonTypes/SocialSystemSettings'
import { fetchMainSettings } from './mainSettingsAction'
import { fetchLinkSettings } from './linkSettingsAction'
import { fetchPaymentSettings } from './paymentSettingsAction'
import { fetchBusinessSettings } from './businessSettingsAction'
import { fetchCaptchaSettings } from './captchaSettingsAction'
import { fetchFacebookLoginSettings } from './facebookSettingsAction'
import { fetchAdsSettings } from './adsSettingsAction'
import { fetchSocialSettings } from './socialSettingsAction'
import { fetchEmailSettings } from './emailSettingsAction'
import { fetchEmailNotificationSettings } from './notificationSettingsAction'

const api = new ApiClient()

export interface SettingsProps {
  main?: MainSystemSettings | null
  links?: LinkSystemSettings | null
  payments?: PaymentSystemSettings | null
  business?: BusinessSystemSettings | null
  captcha?: CaptchaSystemSettings | null
  facebook_login?: FacebookSystemSettings | null
  ads?: AdsSystemSettings | null
  socials?: SocialSystemSettings | null
  email?: EmailSystemSettings | null
  email_notification?: NotificationSystemSettings | null
}

export const getAllSettingsData = async (): Promise<SettingsProps> => {
  const settings = await api.resourceAction({
    resourceId: 'Settings',
    actionName: 'list',
  })
  if (!settings) {
    return Promise.reject(new Error('Settings not found.'))
  }

  const settingsOptions: SettingsProps = {}

  settings.data.records.map((option: BaseRecord) => {
    switch (option.params.key) {
      case 'main':
        settingsOptions.main = fetchMainSettings(option)
        break

      case 'links':
        settingsOptions.links = fetchLinkSettings(option)
        break

      case 'payments':
        settingsOptions.payments = fetchPaymentSettings(option)
        break

      case 'business':
        settingsOptions.business = fetchBusinessSettings(option)
        break

      case 'captcha':
        settingsOptions.captcha = fetchCaptchaSettings(option)
        break

      case 'facebook_login':
        settingsOptions.facebook_login = fetchFacebookLoginSettings(option)
        break

      case 'ads':
        settingsOptions.ads = fetchAdsSettings(option)
        break

      case 'socials':
        settingsOptions.socials = fetchSocialSettings(option)
        break

      case 'email':
        settingsOptions.email = fetchEmailSettings(option)
        break

      case 'email_notification':
        settingsOptions.email_notification = fetchEmailNotificationSettings(option)
        break
    }
  })

  return Promise.resolve(settingsOptions)
}
