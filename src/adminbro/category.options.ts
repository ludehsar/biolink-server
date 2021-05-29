import { ResourceOptions } from 'admin-bro'

import { Category } from '../entities/Category'

export const categoryOptions: ResourceOptions = {
  listProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  editProperties: ['categoryName'],
  showProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  filterProperties: ['categoryName', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] &&
            currentAdmin.role.roleSettings[2].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] &&
            currentAdmin.role.roleSettings[2].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] &&
            currentAdmin.role.roleSettings[2].canDelete === true)
        )
      },
    },
    edit: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] && currentAdmin.role.roleSettings[2].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] &&
            currentAdmin.role.roleSettings[2].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] &&
            currentAdmin.role.roleSettings[2].canShowList === true)
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[2] && currentAdmin.role.roleSettings[2].canShow === true)
        )
      },
    },
  },
  properties: {
    categoryName: {
      isTitle: true,
    },
  },
  navigation: {
    icon: 'Category',
  },
}

export const categoryResource = Category
