import { ResourceOptions } from 'admin-bro'
import { Biolink } from '../../../entities'

export const biolinkOptions: ResourceOptions = {
  listProperties: ['userId', 'categoryId', 'usernameId', 'createdAt', 'updatedAt'],
  navigation: {
    icon: 'Roadmap',
    name: 'Profile Management',
  },
  actions: {
    edit: {
      isVisible: false,
    },
  },
}

export const biolinkResource = Biolink
