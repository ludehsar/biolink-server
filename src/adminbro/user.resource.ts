import { ResourceOptions } from 'admin-bro'

import { User } from '../models/entities/User'

export const userOptions: ResourceOptions = {
  properties: {
    id: {
      isVisible: {
        edit: false, filter: false, list: false, show: true
      }
    },
    billing: {
      isVisible: false
    },
    encryptedPassword: {
      isVisible: false
    },
    emailActivationCode: {
      isVisible: false
    },
    forgotPasswordCode: {
      isVisible: false
    }
  }
}

export const userResource = User
