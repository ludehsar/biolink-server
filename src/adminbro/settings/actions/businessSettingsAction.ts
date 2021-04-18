import { ApiClient, BaseRecord } from 'admin-bro'

import { BusinessSystemSettings } from '../../../models/jsonTypes/BusinessSystemSettings'

const api = new ApiClient()

export const fetchBusinessSettings = (option: BaseRecord): BusinessSystemSettings => {
  const businessSystemSettings: BusinessSystemSettings = {
    enableInvoice: option.params['value.enableInvoice'],
    invoiceNrPrefix: option.params['value.invoiceNrPrefix'],
    name: option.params['value.name'],
    address: option.params['value.address'],
    city: option.params['value.city'],
    country: option.params['value.country'],
    zipCode: option.params['value.zipCode'],
    email: option.params['value.email'],
    phone: option.params['value.phone'],
    taxType: option.params['value.taxType'],
    taxId: option.params['value.taxId'],
  }

  return businessSystemSettings
}

export const saveBusinessSettings = async (options: BusinessSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '4',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
