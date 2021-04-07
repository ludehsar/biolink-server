import { ResourceOptions } from 'admin-bro'
import * as argon2 from 'argon2'

import { User } from '../entities/User'

export const userOptions: ResourceOptions = {
  properties: {
    encryptedPassword: {
      isVisible: false
    },
    password: {
      type: 'password',
      isVisible: {
        list: false, edit: true, filter: false, show: false
      }
    }
  },
  actions: {
    new: {
      before: async (request) => {
        if (request.payload?.password) {
          request.payload = {
            ...request.payload,
            encryptedPassword: await argon2.hash(request.payload.password),
            password: undefined
          }
        }
        return request
      }
    },
    edit: {
      before: async (request) => {
        if (request.payload?.password) {
          request.payload = {
            ...request.payload,
            encryptedPassword: await argon2.hash(request.payload.password),
            password: undefined
          }
        }
        return request
      }
    }
  }
}

export const userResource = User
