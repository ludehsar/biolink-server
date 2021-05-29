import { NoticeMessage } from 'admin-bro'
import {
  MainSystemSettings,
  BiolinkSystemSettings,
  PaymentSystemSettings,
  BusinessSystemSettings,
  CaptchaSystemSettings,
  FacebookSystemSettings,
  AdsSystemSettings,
  SocialSystemSettings,
  EmailSystemSettings,
  NotificationSystemSettings,
} from 'json-types'

export interface CommonSettingsProps {
  className?: string | undefined
  id?: string | undefined
  value?:
    | MainSystemSettings
    | BiolinkSystemSettings
    | PaymentSystemSettings
    | BusinessSystemSettings
    | CaptchaSystemSettings
    | FacebookSystemSettings
    | AdsSystemSettings
    | SocialSystemSettings
    | EmailSystemSettings
    | NotificationSystemSettings
    | null
    | undefined
  addNotice: (notice: NoticeMessage) => void
}
