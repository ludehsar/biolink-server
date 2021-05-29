import AdminBro, { ResourceOptions } from 'admin-bro'

import { Settings } from '../../entities/Settings'

export const settingsOptions: ResourceOptions = {
  actions: {
    list: {
      component: AdminBro.bundle('./components/layout.settings.tsx'),
      hideActionHeader: true,
      showFilter: false,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return currentAdmin.role.roleName === 'Administrator'
      },
    },
    new: {
      isVisible: false,
    },
    show: {
      isVisible: false,
    },
    edit: {
      isVisible: false,
    },
    bulkDelete: {
      isVisible: false,
    },
    delete: {
      isVisible: false,
    },
    search: {
      isVisible: false,
    },
  },
  navigation: {
    icon: 'Settings',
  },
}

export const settingsResource = Settings
