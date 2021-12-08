import AdminBro, { ResourceOptions } from 'admin-bro'

import { User } from '../../../entities/User'
import { after, before } from './actions/password.hook'
import { fetchWithUserLogs } from './actions/userShow.hook'

export const userOptions: ResourceOptions = {
  listProperties: ['email', 'adminRoleId', 'country', 'createdAt', 'updatedAt'],
  editProperties: ['email', 'adminRoleId', 'password'],
  showProperties: [
    'adminRoleId',
    'email',
    'lastIPAddress',
    'country',
    'lastUserAgent',
    'planExpirationDate',
    'planTrialDone',
    'totalLogin',
  ],
  filterProperties: [
    'email',
    'emailVerifiedAt',
    'adminRoleId',
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
    name: 'User Management',
  },
  actions: {
    new: {
      before,
      after,
    },
    show: {
      component: AdminBro.bundle('./pages/user.show.tsx'),
      after: fetchWithUserLogs,
    },
  },
}

export const userResource = User
