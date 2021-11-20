import { Order, Plan, User } from '../entities'
import { PaymentCurrency, PaymentProvider, PaymentType } from '../enums'
import { StripeInvoiceObject } from '../json-types'

export interface PaymentUpdateBody {
  paymentType?: PaymentType
  paymentProvider?: PaymentProvider
  amountPaid?: number
  paymentCurrency?: PaymentCurrency
  paymentDetails?: StripeInvoiceObject
  user?: User
  order?: Order
  plan?: Plan
}
