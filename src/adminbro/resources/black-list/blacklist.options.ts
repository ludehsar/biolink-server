import { ResourceOptions } from 'admin-bro'

import { BlackList } from '../../../entities'

export const blacklistOptions: ResourceOptions = {
  listProperties: ['id', 'blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  editProperties: ['blacklistType', 'keyword', 'reason'],
  showProperties: ['id', 'blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  filterProperties: ['blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  properties: {
    reason: {
      type: 'textarea',
    },
  },
  actions: {
    new: {
      showInDrawer: true,
    },

    edit: {
      showInDrawer: true,
    },
  },
  navigation: {
    icon: 'CheckmarkOutlineError',
  },
}

export const blacklistResource = BlackList
