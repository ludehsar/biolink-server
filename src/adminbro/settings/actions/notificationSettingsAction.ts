import { ApiClient, BaseRecord } from 'admin-bro'

import { NotificationSystemSettings } from '../../../models/jsonTypes/NotificationSystemSettings'

const api = new ApiClient()

export const fetchEmailNotificationSettings = (option: BaseRecord): NotificationSystemSettings => {
  const notificationSystemSettings: NotificationSystemSettings = {
    emailsToBeNotified: option.params['value.emailsToBeNotified'],
    emailOnNewUser: option.params['value.emailOnNewUser'],
    emailOnNewPayment: option.params['value.emailOnNewPayment'],
    emailOnNewCustomDomain: option.params['value.emailOnNewCustomDomain'],
  }

  return notificationSystemSettings
}

export const saveEmailNotificationSettings = async (
  options: NotificationSystemSettings
): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '10',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
