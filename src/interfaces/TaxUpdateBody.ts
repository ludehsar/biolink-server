import { TaxBillingForType, TaxType, TaxValueType } from '../enums'

export interface TaxUpdateBody {
  billingFor?: TaxBillingForType
  countries?: string
  description?: string
  internalName?: string
  name?: string
  type?: TaxType
  value?: number
  valueType?: TaxValueType
}
