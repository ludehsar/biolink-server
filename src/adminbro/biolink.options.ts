import { ResourceOptions } from 'admin-bro'

import { Biolink } from '../models/entities/Biolink'

export const biolinkOptions: ResourceOptions = {
  listProperties: ['userId', 'username', 'categoryId', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'username', 'categoryId', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      isVisible: false,
    },
    show: {
      isVisible: false,
    },
    edit: {
      isVisible: false,
    },
  },
  navigation: {
    icon: 'Roadmap',
  },
}

export const biolinkResource = Biolink
