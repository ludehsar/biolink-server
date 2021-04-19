import { ApiClient, BaseRecord } from 'admin-bro'

import { NotificationSystemSettings } from '../../../models/jsonTypes/NotificationSystemSettings'

const api = new ApiClient()

export const fetchEmailNotificationSettings = (option: BaseRecord): NotificationSystemSettings => {
  let id = 0
  const emailsToBeNotified = []

  while (option.params[`value.emailsToBeNotified.${id}`] !== undefined) {
    emailsToBeNotified.push(option.params[`value.emailsToBeNotified.${id}`])
    id++
  }

  const notificationSystemSettings: NotificationSystemSettings = {
    emailsToBeNotified,
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
