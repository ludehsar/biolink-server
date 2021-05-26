import { ResourceOptions } from 'admin-bro'

import { Link } from '../models/entities/Link'

export const linkOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'biolinkId',
    'url',
    'shortenedUrl',
    'clicks',
    'status',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'userId',
    'biolinkId',
    'url',
    'shortenedUrl',
    'status',
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
          (currentAdmin.role.roleSettings[5] &&
            currentAdmin.role.roleSettings[5].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] &&
            currentAdmin.role.roleSettings[5].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] &&
            currentAdmin.role.roleSettings[5].canDelete === true)
        )
      },
    },
    edit: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] && currentAdmin.role.roleSettings[5].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] &&
            currentAdmin.role.roleSettings[5].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] &&
            currentAdmin.role.roleSettings[5].canShowList === true)
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[5] && currentAdmin.role.roleSettings[5].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Link',
  },
}

export const linkResource = Link
