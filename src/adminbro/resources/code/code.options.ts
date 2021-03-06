import { ResourceOptions } from 'admin-bro'

import { Code } from '../../../entities'

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
  navigation: {
    icon: 'QrCode',
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const codeResource = Code
