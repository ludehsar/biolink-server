import { ResourceOptions } from 'admin-bro'

import { Tax } from '../../../entities'

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
  navigation: {
    icon: 'Document',
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const taxResource = Tax
