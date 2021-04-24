import { ResourceOptions } from 'admin-bro'

import { PremiumUsername } from '../models/entities/PremiumUsername'

export const premiumUsernameOptions: ResourceOptions = {
  listProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  editProperties: ['username', 'ownerId', 'price', 'usernameType'],
  showProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  filterProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
    },
    show: {
      isVisible: false,
    },
    edit: {
      showInDrawer: true,
    },
  },
  navigation: {
    icon: 'Gift',
  },
}

export const premiumUsernameResource = PremiumUsername
