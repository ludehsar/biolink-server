import { Billing } from '../json-types'
import { AdminRole, Code, Plan } from '../entities'
import { PlanType } from '../enums'

export interface UserUpdateBody {
  adminRole?: AdminRole
  authenticatorSecret?: string
  billing?: Billing
  country?: string
  currentBiolinkId?: string
  email?: string
  emailVerifiedAt?: Date | null
  password?: string
  facebookId?: string
  language?: string
  lastActiveTill?: Date
  lastIPAddress?: string
  lastUserAgent?: string
  plan?: Plan
  planExpirationDate?: Date | null
  planTrialDone?: boolean
  planType?: PlanType
  registeredByCode?: Code
  stripeCustomerId?: string
  timezone?: string
  totalLogin?: number
  usedReferralsToPurchasePlan?: boolean
  availableBalance?: number
}
