import AdminBro, { ResourceOptions } from 'admin-bro'

import { Plan } from '../../entities/Plan'

export const planOptions: ResourceOptions = {
  listProperties: ['name', 'monthlyPrice', 'annualPrice', 'enabledStatus', 'visibilityStatus'],
  filterProperties: [
    'name',
    'monthlyPrice',
    'monthlyPriceStripeId',
    'annualPrice',
    'annualPriceStripeId',
    'enabledStatus',
    'visibilityStatus',
  ],
  editProperties: [
    'name',
    'monthlyPrice',
    'monthlyPriceStripeId',
    'annualPrice',
    'annualPriceStripeId',
    'enabledStatus',
    'visibilityStatus',
    'settings',
  ],
  properties: {
    settings: {
      components: {
        edit: AdminBro.bundle('./components/plan-settings.edit.tsx'),
      },
    },
    name: {
      isTitle: true,
    },
  },
  actions: {
    new: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] &&
            currentAdmin.role.roleSettings[6].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] &&
            currentAdmin.role.roleSettings[6].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] &&
            currentAdmin.role.roleSettings[6].canDelete === true)
        )
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] && currentAdmin.role.roleSettings[6].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] &&
            currentAdmin.role.roleSettings[6].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] &&
            currentAdmin.role.roleSettings[6].canShowList === true)
        )
      },
    },
    show: {
      isVisible: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[6] && currentAdmin.role.roleSettings[6].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Event',
  },
}

export const planResource = Plan
