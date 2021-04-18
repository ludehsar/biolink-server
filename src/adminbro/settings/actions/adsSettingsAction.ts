import { ApiClient, BaseRecord } from 'admin-bro'

import { AdsSystemSettings } from '../../../models/jsonTypes/AdsSystemSettings'

const api = new ApiClient()

export const fetchAdsSettings = (option: BaseRecord): AdsSystemSettings => {
  const adsSystemSettings: AdsSystemSettings = {
    header: option.params['value.header'],
    footer: option.params['value.footer'],
    biolinkPageHeader: option.params['value.biolinkPageHeader'],
    biolinkPageFooter: option.params['value.biolinkPageFooter'],
  }

  return adsSystemSettings
}

export const saveAdsSettings = async (options: AdsSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '7',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
