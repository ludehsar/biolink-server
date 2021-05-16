import { ResourceOptions } from 'admin-bro'

import { UserLogs } from '../models/entities/UserLogs'

export const logsOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'ipAddress',
    'deviceType',
    'osName',
    'browserName',
    'browserLanguage',
    'cityName',
    'countryCode',
    'description',
    'createdAt',
  ],
  filterProperties: [
    'userId',
    'ipAddress',
    'deviceType',
    'osName',
    'browserName',
    'browserLanguage',
    'cityName',
    'countryCode',
    'description',
    'createdAt',
  ],
  actions: {
    new: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canCreate === 'true'
        )
      },
    },
    bulkDelete: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canDelete === 'true'
        )
      },
    },
    delete: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canDelete === 'true'
        )
      },
    },
    edit: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canEdit === 'true'
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canShowList === 'true'
        )
      },
    },
    search: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canShowList === 'true'
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[11].canShow === 'true'
        )
      },
    },
  },
  navigation: {
    icon: 'Archive',
  },
}

export const logsResources = UserLogs
