import { ResourceOptions } from 'admin-bro'

import { Code } from '../models/entities/Code'

export const codeOptions: ResourceOptions = {
  listProperties: [
    'type',
    'code',
    'discount',
    'quantity',
    'expireDate',
    'planId',
    'createdAt',
    'updatedAt',
  ],
  editProperties: ['type', 'code', 'discount', 'quantity', 'expireDate', 'planId'],
  showProperties: [
    'type',
    'code',
    'discount',
    'quantity',
    'expireDate',
    'planId',
    'createdAt',
    'updatedAt',
  ],
  filterProperties: [
    'type',
    'code',
    'discount',
    'quantity',
    'expireDate',
    'planId',
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
}

export const codeResource = Code
