import AdminBro, { ResourceOptions } from 'admin-bro'

import { User } from '../../models/entities/User'
import { after, before } from './actions/password.hook'

export const userOptions: ResourceOptions = {
  listProperties: [
    'name',
    'email',
    'adminRoleId',
    'accountStatus',
    'country',
    'createdAt',
    'updatedAt',
  ],
  editProperties: ['name', 'email', 'adminRoleId', 'password'],
  showProperties: [
    'adminRoleId',
    'email',
    'name',
    'accountStatus',
    'lastIPAddress',
    'country',
    'lastUserAgent',
    'planExpirationDate',
    'planTrialDone',
    'totalLogin',
  ],
  filterProperties: [
    'name',
    'email',
    'emailVerifiedAt',
    'adminRoleId',
    'accountStatus',
    'language',
    'timezone',
    'country',
    'planExpirationDate',
    'planTrialDone',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    password: {
      type: 'password',
      isVisible: {
        list: false,
        edit: true,
        filter: false,
        show: false,
      },
    },
  },
  navigation: {
    icon: 'UserMultiple',
  },
  actions: {
    show: {
      component: AdminBro.bundle('./components/user.show.tsx'),
    },
    new: { before, after },
  },
}

export const userResource = User
