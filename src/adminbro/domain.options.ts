import { ResourceOptions } from 'admin-bro'

import { Domain } from '../models/entities/Domain'

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
  actions: {
    new: {
      isVisible: false,
    },
    show: {
      isVisible: false,
    },
    edit: {
      isVisible: false,
    },
  },
  navigation: {
    icon: 'Wikis',
  },
}

export const domainResource = Domain
