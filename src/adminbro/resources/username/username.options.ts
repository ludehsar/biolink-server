import { ResourceOptions } from 'admin-bro'
import { Username } from '../../../entities'

export const usernameOptions: ResourceOptions = {
  navigation: {
    name: 'Profile Management',
  },
  properties: {
    username: {
      isTitle: true,
    },
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const usernameResource = Username
