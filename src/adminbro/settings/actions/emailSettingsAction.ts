import { ApiClient, BaseRecord } from 'admin-bro'

import { EmailSystemSettings } from '../../../models/jsonTypes/EmailSystemSettings'

const api = new ApiClient()

export const fetchEmailSettings = (option: BaseRecord): EmailSystemSettings => {
  const emailSystemSettings: EmailSystemSettings = {
    fromName: option.params['value.fromName'],
  }

  return emailSystemSettings
}

export const saveEmailSettings = async (options: EmailSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '9',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
