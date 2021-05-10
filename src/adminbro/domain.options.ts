import { ResourceOptions } from 'admin-bro'

import { Domain } from '../models/entities/Domain'

export const domainOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'scheme',
    'host',
    'customIndexUrl',
    'enabledStatus',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'userId',
    'scheme',
    'host',
    'customIndexUrl',
    'enabledStatus',
    'createdAt',
    'updatedAt',
  ],
  actions: {
    new: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canCreate === 'true'
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canDelete === 'true'
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canDelete === 'true'
        )
      },
    },
    edit: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canEdit === 'true'
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canShowList === 'true'
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canShowList === 'true'
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role.roleSettings[4].canShow === 'true'
        )
      },
    },
  },
  navigation: {
    icon: 'Wikis',
  },
}

export const domainResource = Domain
