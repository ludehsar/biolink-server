import { createUnionType } from 'type-graphql'
import { PaypalPaymentRecord, StripeInvoiceObject } from '../json-types'

export const PaymentRecordUnion = createUnionType({
  name: 'PaymentRecord',
  types: () => [StripeInvoiceObject, PaypalPaymentRecord] as const,
  resolveType: (value) => {
    if ('object' in value) {
      return StripeInvoiceObject
    }
    if ('payer' in value) {
      return PaypalPaymentRecord
    }
    return undefined
  },
})
