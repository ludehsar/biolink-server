import AdminBro, { ResourceOptions } from 'admin-bro'

import { AdminRole } from '../../../entities'
import { before } from './actions/settings.hook'

export const adminRoleOptions: ResourceOptions = {
  listProperties: ['id', 'roleName', 'roleDescription', 'createdAt', 'updatedAt'],
  editProperties: ['roleName', 'roleDescription', 'roleSettings'],
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
      before,
    },
    edit: {
      before,
      isVisible: false,
    },
  },
  navigation: {
    name: 'User Management',
  },
}

export const adminRoleResources = AdminRole
