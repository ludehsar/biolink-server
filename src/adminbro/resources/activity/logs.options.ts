import { ResourceOptions } from 'admin-bro'

import { UserLogs } from '../../../entities'

export const logsOptions: ResourceOptions = {
  listProperties: ['userId', 'ipAddress', 'deviceType', 'countryCode', 'description', 'createdAt'],
  filterProperties: [
    'userId',
    'ipAddress',
    'deviceType',
    'osName',
    'browserName',
    'browserLanguage',
    'cityName',
    'countryCode',
    'description',
    'createdAt',
  ],
  showProperties: [
    'userId',
    'ipAddress',
    'deviceType',
    'osName',
    'browserName',
    'browserLanguage',
    'cityName',
    'countryCode',
    'description',
    'createdAt',
  ],
  actions: {
    show: {
      showInDrawer: true,
    },
  },
  navigation: {
    icon: 'Archive',
  },
  sort: {
    sortBy: 'createdAt',
    direction: 'desc',
  },
}

export const logsResources = UserLogs
