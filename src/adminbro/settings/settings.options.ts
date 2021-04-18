import AdminBro, { ResourceOptions } from 'admin-bro'

import { Settings } from '../../models/entities/Settings'

export const settingsOptions: ResourceOptions = {
  actions: {
    list: {
      component: AdminBro.bundle('./components/layout.settings.tsx'),
      hideActionHeader: true,
      showFilter: false,
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
