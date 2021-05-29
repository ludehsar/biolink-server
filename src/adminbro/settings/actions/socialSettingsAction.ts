import { ApiClient, BaseRecord } from 'admin-bro'

import { SocialSystemSettings } from 'json-types'

const api = new ApiClient()

export const fetchSocialSettings = (option: BaseRecord): SocialSystemSettings => {
  const socialSystemSettings: SocialSystemSettings = {
    youtube: option.params['value.youtube'],
    facebook: option.params['value.facebook'],
    twitter: option.params['value.twitter'],
    instagram: option.params['value.instagram'],
  }

  return socialSystemSettings
}

export const saveSocialSettings = async (options: SocialSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '8',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
