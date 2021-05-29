import { ApiClient, BaseRecord } from 'admin-bro'

import { FacebookSystemSettings } from 'json-types'

const api = new ApiClient()

export const fetchFacebookLoginSettings = (option: BaseRecord): FacebookSystemSettings => {
  const facebookSystemSettings: FacebookSystemSettings = {
    enableFacebookLogin: option.params['value.enableFacebookLogin'],
  }

  return facebookSystemSettings
}

export const saveFacebookLoginSettings = async (options: FacebookSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '6',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
