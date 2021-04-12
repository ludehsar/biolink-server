import { ResourceOptions } from 'admin-bro'

import { User } from '../../models/entities/User'

export const userOptions: ResourceOptions = {
  properties: {
    id: {
      isVisible: {
        edit: false,
        filter: false,
        list: false,
        show: true,
      },
    },
    billing: {
      isVisible: false,
    },
    encryptedPassword: {
      isVisible: false,
    },
    emailActivationCode: {
      isVisible: false,
    },
    forgotPasswordCode: {
      isVisible: false,
    },
    tokenCode: {
      isVisible: false,
    },
    authenticatorSecret: {
      isVisible: false,
    },
    facebookId: {
      isVisible: false,
    },
  },
  navigation: {
    icon: 'User',
  },
}

export const userResource = User
