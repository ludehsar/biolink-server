import { ResourceOptions } from 'admin-bro'

import { Link } from '../../../entities'

export const linkOptions: ResourceOptions = {
  listProperties: ['userId', 'biolinkId', 'url', 'shortenedUrl', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'biolinkId', 'url', 'shortenedUrl', 'createdAt', 'updatedAt'],
  navigation: {
    icon: 'Link',
  },
}

export const linkResource = Link
