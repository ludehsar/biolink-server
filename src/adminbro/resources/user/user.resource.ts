import AdminBro, { ResourceOptions } from 'admin-bro'

import { User } from '../../../entities/User'
import { after, before } from './actions/password.hook'
import { fetchWithUserLogs } from './actions/userShow.hook'

export const userOptions: ResourceOptions = {
  listProperties: [
    'id',
    'email',
    'emailVerifiedAt',
    'adminRoleId',
    'planType',
    'planId',
    'planTrialDone',
    'country',
  ],
  properties: {
    email: {
      isTitle: true,
    },
    password: {
      type: 'password',
      isVisible: {
        list: false,
        edit: true,
        filter: false,
        show: false,
      },
    },
    encryptedPassword: {
      isVisible: false,
    },
    authenticatorSecret: {
      isVisible: false,
    },
    facebookId: {
      isVisible: false,
    },
    lastActiveTill: {
      isVisible: {
        edit: false,
      },
    },
    language: {
      isVisible: {
        edit: false,
      },
    },
    timezone: {
      isVisible: {
        edit: false,
      },
    },
    lastIPAddress: {
      isVisible: {
        edit: false,
      },
    },
    lastUserAgent: {
      isVisible: {
        edit: false,
      },
    },
    country: {
      isVisible: {
        edit: false,
      },
    },
    totalLogin: {
      isVisible: {
        edit: false,
      },
    },
    currentBiolinkId: {
      isVisible: {
        edit: false,
      },
    },
    deletedAt: {
      isVisible: false,
    },
    billing: {
      type: 'mixed',
      isVisible: false,
    },
    'billing.type': {
      type: 'string',
      availableValues: [
        {
          label: 'Personal',
          value: 'Personal',
        },
        {
          label: 'Business',
          value: 'Business',
        },
      ],
    },
    'billing.name': {
      type: 'string',
    },
    'billing.address1': {
      type: 'textarea',
    },
    'billing.address2': {
      type: 'textarea',
    },
    'billing.city': {
      type: 'string',
    },
    'billing.state': {
      type: 'string',
    },
    'billing.country': {
      type: 'string',
    },
    'billing.zip': {
      type: 'string',
    },
    'billing.phone': {
      type: 'string',
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
