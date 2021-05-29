import { ResourceOptions } from 'admin-bro'

import { Code } from '../entities/Code'

export const codeOptions: ResourceOptions = {
  listProperties: ['type', 'code', 'discount', 'quantity', 'expireDate', 'createdAt', 'updatedAt'],
  editProperties: ['type', 'code', 'discount', 'quantity', 'expireDate'],
  showProperties: ['type', 'code', 'discount', 'quantity', 'expireDate', 'createdAt', 'updatedAt'],
  filterProperties: [
    'type',
    'code',
    'discount',
    'quantity',
    'expireDate',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    code: {
      isTitle: true,
    },
  },
  actions: {
    new: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] &&
            currentAdmin.role.roleSettings[3].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] &&
            currentAdmin.role.roleSettings[3].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] &&
            currentAdmin.role.roleSettings[3].canDelete === true)
        )
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] && currentAdmin.role.roleSettings[3].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] &&
            currentAdmin.role.roleSettings[3].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] &&
            currentAdmin.role.roleSettings[3].canShowList === true)
        )
      },
    },
    show: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[3] && currentAdmin.role.roleSettings[3].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'QrCode',
  },
}

export const codeResource = Code
