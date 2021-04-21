import { ResourceOptions } from 'admin-bro'

import { Link } from '../models/entities/Link'

export const linkOptions: ResourceOptions = {
  listProperties: ['userId', 'biolinkId', 'url', 'clicks', 'status', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'biolinkId', 'url', 'status', 'createdAt', 'updatedAt'],
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
