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
}

export const domainResource = Domain
