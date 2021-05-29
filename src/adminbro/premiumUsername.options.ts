import { ResourceOptions } from 'admin-bro'

import { PremiumUsername } from '../entities/PremiumUsername'

export const premiumUsernameOptions: ResourceOptions = {
  listProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  editProperties: ['username', 'ownerId', 'price', 'usernameType'],
  showProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  filterProperties: ['username', 'ownerId', 'price', 'usernameType', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] &&
            currentAdmin.role.roleSettings[7].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] &&
            currentAdmin.role.roleSettings[7].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] &&
            currentAdmin.role.roleSettings[7].canDelete === true)
        )
      },
    },
    edit: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] && currentAdmin.role.roleSettings[7].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] &&
            currentAdmin.role.roleSettings[7].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] &&
            currentAdmin.role.roleSettings[7].canShowList === true)
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[7] && currentAdmin.role.roleSettings[7].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Gift',
  },
}

export const premiumUsernameResource = PremiumUsername
