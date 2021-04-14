import AdminBro, { ResourceOptions } from 'admin-bro'

import { User } from '../../models/entities/User'
import { after, before } from './actions/password.hook'

export const userOptions: ResourceOptions = {
  listProperties: [
    'name',
    'email',
    'username',
    'userRole',
    'accountStatus',
    'country',
    'createdAt',
    'updatedAt',
  ],
  editProperties: ['name', 'email', 'username', 'userRole', 'password'],
  showProperties: [
    'userRole',
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
    'username',
    'name',
    'email',
    'emailVerifiedAt',
    'userRole',
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
