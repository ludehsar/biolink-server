import { ResourceOptions } from 'admin-bro'

import { Plan } from '../models/entities/Plan'

export const planOptions: ResourceOptions = {
  listProperties: [
    'name',
    'monthlyPrice',
    'annualPrice',
    'lifetimePrice',
    'enabledStatus',
    'visibilityStatus',
  ],
  filterProperties: [
    'name',
    'monthlyPrice',
    'annualPrice',
    'lifetimePrice',
    'enabledStatus',
    'visibilityStatus',
  ],
  navigation: {
    icon: 'Event',
  },
}

export const planResource = Plan
