import { createUnionType } from 'type-graphql'
import {
  AdsSystemSettings,
  BusinessSystemSettings,
  CaptchaSystemSettings,
  EmailSystemSettings,
  FacebookSystemSettings,
  LinkSystemSettings,
  MainSystemSettings,
  NotificationSystemSettings,
  PaymentSystemSettings,
  SocialSystemSettings,
} from '../json-types'

export const SettingsRecordUnion = createUnionType({
  name: 'SettingsRecord',
  types: () =>
    [
      AdsSystemSettings,
      LinkSystemSettings,
      MainSystemSettings,
      EmailSystemSettings,
      SocialSystemSettings,
      CaptchaSystemSettings,
      PaymentSystemSettings,
      BusinessSystemSettings,
      FacebookSystemSettings,
      NotificationSystemSettings,
    ] as const,
  resolveType: (value) => {
    if ('header' in value) {
      return AdsSystemSettings
    }
    if ('enableInvoice' in value) {
      return BusinessSystemSettings
    }
    if ('captchaType' in value) {
      return CaptchaSystemSettings
    }
    if ('fromName' in value) {
      return EmailSystemSettings
    }
    if ('enableFacebookLogin' in value) {
      return FacebookSystemSettings
    }
    if ('branding' in value) {
      return LinkSystemSettings
    }
    if ('title' in value) {
      return MainSystemSettings
    }
    if ('emailsToBeNotified' in value) {
      return NotificationSystemSettings
    }
    if ('enablePaymentSystem' in value) {
      return PaymentSystemSettings
    }
    if ('youtube' in value) {
      return SocialSystemSettings
    }
    return undefined
  },
})
