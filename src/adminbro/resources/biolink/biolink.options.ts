import { ResourceOptions } from 'admin-bro'
import { Biolink } from '../../../entities'

export const biolinkOptions: ResourceOptions = {
  listProperties: ['userId', 'categoryId', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'categoryId', 'createdAt', 'updatedAt'],
  navigation: {
    icon: 'Roadmap',
  },
}

export const biolinkResource = Biolink
