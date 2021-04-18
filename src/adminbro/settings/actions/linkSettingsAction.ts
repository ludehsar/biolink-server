import { ApiClient, BaseRecord } from 'admin-bro'

import { LinkSystemSettings } from '../../../models/jsonTypes/LinkSystemSettings'

const api = new ApiClient()

export const fetchLinkSettings = (option: BaseRecord): LinkSystemSettings => {
  const linkSystemSettings: LinkSystemSettings = {
    branding: option.params['value.branding'],
    enableLinkShortenerSystem: option.params['value.enableLinkShortenerSystem'],
    enableCustomDomainSystem: option.params['value.enableCustomDomainSystem'],
    enableMainDomainUsage: option.params['values.enableMainDomainUsage'],
    blacklistedDomains: option.params['value.blacklistedDomains'],
    blacklistedKeywords: option.params['value.blacklistedKeywords'],
    enablePhishtank: option.params['value.enablePhishtank'],
    enableGoogleSafeBrowsing: option.params['value.enableGoogleSafeBrowsing'],
  }

  return linkSystemSettings
}

export const saveLinkSettings = async (options: LinkSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '2',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
