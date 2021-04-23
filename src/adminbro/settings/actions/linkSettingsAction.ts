import { ApiClient, BaseRecord } from 'admin-bro'

import { BiolinkSystemSettings } from '../../../models/jsonTypes/BiolinkSystemSettings'

const api = new ApiClient()

export const fetchLinkSettings = (option: BaseRecord): BiolinkSystemSettings => {
  let id = 0
  const blacklistedDomains = []

  while (option.params[`value.blacklistedDomains.${id}`] !== undefined) {
    blacklistedDomains.push(option.params[`value.blacklistedDomains.${id}`])
    id++
  }

  id = 0
  const blacklistedKeywords = []

  while (option.params[`value.blacklistedKeywords.${id}`] !== undefined) {
    blacklistedKeywords.push(option.params[`value.blacklistedKeywords.${id}`])
    id++
  }

  const linkSystemSettings: BiolinkSystemSettings = {
    branding: option.params['value.branding'],
    enableLinkShortenerSystem: option.params['value.enableLinkShortenerSystem'],
    enableCustomDomainSystem: option.params['value.enableCustomDomainSystem'],
    enableMainDomainUsage: option.params['value.enableMainDomainUsage'],
    blacklistedDomains,
    blacklistedKeywords,
    enablePhishtank: option.params['value.enablePhishtank'],
    enableGoogleSafeBrowsing: option.params['value.enableGoogleSafeBrowsing'],
  }

  return linkSystemSettings
}

export const saveLinkSettings = async (options: BiolinkSystemSettings): Promise<void> => {
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
