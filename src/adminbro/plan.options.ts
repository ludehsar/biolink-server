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
    'users',
  ],
  filterProperties: [
    'name',
    'monthlyPrice',
    'annualPrice',
    'lifetimePrice',
    'enabledStatus',
    'visibilityStatus',
    'users',
  ],
  navigation: {
    icon: 'Event',
  },
}

export const planResource = Plan
