import { ResourceOptions } from 'admin-bro'

import { Link } from '../models/entities/Link'

export const linkOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'projectId',
    'biolinkId',
    'linkType',
    'url',
    'clicks',
    'status',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'userId',
    'projectId',
    'biolinkId',
    'linkType',
    'url',
    'status',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    userId: {
      reference: 'User',
    },
  },
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
    icon: 'Link',
  },
}

export const linkResource = Link
