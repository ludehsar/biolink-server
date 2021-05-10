import { ResourceOptions } from 'admin-bro'

import { BlackList } from '../models/entities/BlackList'

export const blacklistOptions: ResourceOptions = {
  listProperties: ['id', 'blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  editProperties: ['blacklistType', 'keyword', 'reason'],
  showProperties: ['id', 'blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  filterProperties: ['blacklistType', 'keyword', 'reason', 'createdAt', 'updatedAt'],
  properties: {
    reason: {
      type: 'textarea',
    },
  },
  actions: {
    new: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canCreate'] === 'true'
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canDelete'] === 'true'
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canDelete'] === 'true'
        )
      },
    },
    edit: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canEdit'] === 'true'
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canShowList'] === 'true'
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canShowList'] === 'true'
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          currentAdmin.role['roleSettings.1.canShow'] === 'true'
        )
      },
    },
  },
  navigation: {
    icon: 'CheckmarkOutlineError',
  },
}

export const blacklistResource = BlackList
