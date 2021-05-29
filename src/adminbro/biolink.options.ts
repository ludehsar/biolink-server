import { ResourceOptions } from 'admin-bro'
import { Biolink } from 'entities'

export const biolinkOptions: ResourceOptions = {
  listProperties: ['userId', 'username', 'categoryId', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'username', 'categoryId', 'createdAt', 'updatedAt'],
  properties: {
    username: {
      isTitle: true,
    },
  },
  actions: {
    new: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] &&
            currentAdmin.role.roleSettings[0].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] &&
            currentAdmin.role.roleSettings[0].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] &&
            currentAdmin.role.roleSettings[0].canDelete === true)
        )
      },
    },
    edit: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] && currentAdmin.role.roleSettings[0].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] &&
            currentAdmin.role.roleSettings[0].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] &&
            currentAdmin.role.roleSettings[0].canShowList === true)
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[0] && currentAdmin.role.roleSettings[0].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Roadmap',
  },
}

export const biolinkResource = Biolink
