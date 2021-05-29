import { ApiClient, BaseRecord } from 'admin-bro'

import { PaymentSystemSettings } from 'json-types'

const api = new ApiClient()

export const fetchPaymentSettings = (option: BaseRecord): PaymentSystemSettings => {
  const paymentSystemSettings: PaymentSystemSettings = {
    enablePaymentSystem: option.params['value.enablePaymentSystem'],
    enabledPaymentType: option.params['value.enabledPaymentType'],
    brandName: option.params['value.brandName'],
    currency: option.params['value.currency'],
    enableDiscountOrRedeemableCode: option.params['value.enableDiscountOrRedeemableCode'],
    enableTaxesAndBilling: option.params['value.enableTaxesAndBilling'],
    enablePaypal: option.params['value.enablePaypal'],
    enableStripe: option.params['value.enableStripe'],
  }

  return paymentSystemSettings
}

export const savePaymentSettings = async (options: PaymentSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '3',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
