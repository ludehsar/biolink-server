import AdminBro, { ResourceOptions } from 'admin-bro'

import { Plan } from '../../../entities'

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
  navigation: {
    icon: 'Event',
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const planResource = Plan
