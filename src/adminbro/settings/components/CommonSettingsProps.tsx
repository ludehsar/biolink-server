import { NoticeMessage } from 'admin-bro'
import { AdsSystemSettings } from 'models/jsonTypes/AdsSystemSettings'
import { BusinessSystemSettings } from 'models/jsonTypes/BusinessSystemSettings'
import { CaptchaSystemSettings } from 'models/jsonTypes/CaptchaSystemSettings'
import { EmailSystemSettings } from 'models/jsonTypes/EmailSystemSettings'
import { FacebookSystemSettings } from 'models/jsonTypes/FacebookSystemSettings'
import { LinkSystemSettings } from 'models/jsonTypes/LinkSystemSettings'
import { MainSystemSettings } from 'models/jsonTypes/MainSystemSettings'
import { NotificationSystemSettings } from 'models/jsonTypes/NotificationSystemSettings'
import { PaymentSystemSettings } from 'models/jsonTypes/PaymentSystemSettings'
import { SocialSystemSettings } from 'models/jsonTypes/SocialSystemSettings'

export interface CommonSettingsProps {
  className?: string | undefined
  id?: string | undefined
  value?:
    | MainSystemSettings
    | LinkSystemSettings
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
