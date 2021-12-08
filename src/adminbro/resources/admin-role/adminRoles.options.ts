import AdminBro, { ResourceOptions } from 'admin-bro'

import { AdminRole } from '../../../entities'
import { before } from './actions/settings.hook'

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
      before,
    },
    edit: {
      before,
    },
  },
  navigation: {
    icon: 'IbmSecurity',
  },
}

export const adminRoleResources = AdminRole
