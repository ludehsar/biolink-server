import { EnabledStatus } from '../enums'
import { PlanSettings } from '../json-types'

export interface PlanUpdateBody {
  annualPrice?: number
  annualPriceStripeId?: string
  enabledStatus?: EnabledStatus
  monthlyPrice?: number
  monthlyPriceStripeId?: string
  name?: string
  settings?: PlanSettings
  visibilityStatus?: boolean
}
