import { Order, Plan, User } from '../entities'
import { PaymentCurrency, PaymentProvider, PaymentType } from '../enums'
import { PaypalPaymentRecord, StripeInvoiceObject } from '../json-types'

export interface PaymentUpdateBody {
  representedId?: string
  paymentType?: PaymentType
  paymentProvider?: PaymentProvider
  amountPaid?: number
  paymentCurrency?: PaymentCurrency
  paymentDetails?: StripeInvoiceObject | PaypalPaymentRecord
  user?: User
  order?: Order
  plan?: Plan
}
