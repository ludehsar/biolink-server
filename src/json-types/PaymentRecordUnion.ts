import { createUnionType } from 'type-graphql'
import { PaypalPaymentRecord, StripeInvoiceObject } from '../json-types'

export const PaymentRecordUnion = createUnionType({
  name: 'PaymentRecord',
  types: () => [StripeInvoiceObject, PaypalPaymentRecord] as const,
})
