import { ResourceOptions } from 'admin-bro'

import { Tax } from '../models/entities/Tax'

export const taxOptions: ResourceOptions = {
  listProperties: [
    'internalName',
    'name',
    'description',
    'value',
    'valueType',
    'type',
    'billingFor',
    'countries',
    'createdAt',
    'updatedAt',
  ],
  editProperties: [
    'internalName',
    'name',
    'description',
    'value',
    'valueType',
    'type',
    'billingFor',
    'countries',
  ],
  showProperties: [
    'internalName',
    'name',
    'description',
    'value',
    'valueType',
    'type',
    'billingFor',
    'countries',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'internalName',
    'name',
    'description',
    'value',
    'valueType',
    'type',
    'billingFor',
    'countries',
    'createdAt',
    'updatedAt',
  ],
  actions: {
    new: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] &&
            currentAdmin.role.roleSettings[8].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] &&
            currentAdmin.role.roleSettings[8].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] &&
            currentAdmin.role.roleSettings[8].canDelete === true)
        )
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] && currentAdmin.role.roleSettings[8].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] &&
            currentAdmin.role.roleSettings[8].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] &&
            currentAdmin.role.roleSettings[8].canShowList === true)
        )
      },
    },
    show: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[8] && currentAdmin.role.roleSettings[8].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Document',
  },
}

export const taxResource = Tax
