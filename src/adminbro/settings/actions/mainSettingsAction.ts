import { ApiClient, BaseRecord } from 'admin-bro'

import { MainSystemSettings } from '../../../models/jsonTypes/MainSystemSettings'

const api = new ApiClient()

export const fetchMainSettings = (option: BaseRecord): MainSystemSettings => {
  const mainSystemSettings: MainSystemSettings = {
    title: option.params['value.title'],
    defaultLanguage: option.params['value.defaultLanguage'],
    websiteLogoUrl: option.params['value.websiteLogoUrl'],
    faviconLogoUrl: option.params['values.faviconLogoUrl'],
    defaultTimezone: option.params['value.defaultTimezone'],
    enableEmailConfirmation: option.params['value.enableEmailConfirmation'],
    enableNewUserRegistration: option.params['value.enableNewUserRegistration'],
    termsAndConditionsUrl: option.params['value.termsAndConditionsUrl'],
    privacyPolicyUrl: option.params['value.privacyPolicyUrl'],
  }

  return mainSystemSettings
}

export const saveMainSettings = async (options: MainSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '1',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
