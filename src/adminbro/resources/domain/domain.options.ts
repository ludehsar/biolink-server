import { ResourceOptions } from 'admin-bro'

import { Domain } from '../../../entities'

export const domainOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'scheme',
    'host',
    'customIndexUrl',
    'enabledStatus',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'userId',
    'scheme',
    'host',
    'customIndexUrl',
    'enabledStatus',
    'createdAt',
    'updatedAt',
  ],
  navigation: {
    icon: 'Wikis',
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const domainResource = Domain
