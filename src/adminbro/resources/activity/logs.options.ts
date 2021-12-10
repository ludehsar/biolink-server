import { ResourceOptions } from 'admin-bro'

import { UserLogs } from '../../../entities'

export const logsOptions: ResourceOptions = {
  listProperties: ['userId', 'ipAddress', 'deviceType', 'countryCode', 'description', 'createdAt'],
  actions: {
    show: {
      showInDrawer: true,
    },
    edit: {
      isVisible: false,
    },
    new: {
      isVisible: false,
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
