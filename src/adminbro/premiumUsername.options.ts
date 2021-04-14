import { ResourceOptions } from 'admin-bro'

import { PremiumUsername } from '../models/entities/PremiumUsername'

export const premiumUsernameOptions: ResourceOptions = {
  listProperties: ['username', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  editProperties: ['username', 'price', 'usernameType'],
  showProperties: ['username', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  filterProperties: ['username', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
    },
    show: {
      showInDrawer: true,
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
