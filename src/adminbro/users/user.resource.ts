import AdminBro, { ResourceOptions } from 'admin-bro'

import { User } from '../../models/entities/User'
import { after, before } from './actions/password.hook'
import { fetchWithUserLogs } from './actions/userShow.hook'

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
    new: {
      before,
      after,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canCreate === 'true'
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canDelete === 'true'
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canDelete === 'true'
        )
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canEdit === 'true'
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        console.log(currentAdmin.role)
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canShowList === 'true'
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canShowList === 'true'
        )
      },
    },
    show: {
      component: AdminBro.bundle('./components/user.show.tsx'),
      after: fetchWithUserLogs,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[9].canShow === 'true'
        )
      },
    },
  },
}

export const userResource = User
