import AdminBro, { ResourceOptions } from 'admin-bro'

import { AdminRole } from '../../models/entities/AdminRole'

export const adminRoleOptions: ResourceOptions = {
  listProperties: ['id', 'roleName', 'roleDescription', 'createdAt', 'updatedAt'],
  editProperties: ['roleName', 'roleDescription', 'roleSettings'],
  showProperties: ['id', 'roleName', 'roleDescription', 'createdAt', 'updatedAt', 'roleSettings'],
  filterProperties: ['roleName', 'roleDescription', 'createdAt', 'updatedAt'],
  properties: {
    roleName: {
      isTitle: true,
    },
    roleSettings: {
      components: {
        edit: AdminBro.bundle('./components/roleSettings.edit.tsx'),
        show: AdminBro.bundle('./components/roleSettings.show.tsx'),
      },
    },
  },
  actions: {
    new: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    show: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
  },
  navigation: {
    icon: 'IbmSecurity',
  },
}

export const adminRoleResources = AdminRole
