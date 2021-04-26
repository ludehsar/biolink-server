import AdminBro, { ResourceOptions } from 'admin-bro'

import { Plan } from '../../models/entities/Plan'

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
    show: {
      isVisible: false,
    },
  },
  navigation: {
    icon: 'Event',
  },
}

export const planResource = Plan
