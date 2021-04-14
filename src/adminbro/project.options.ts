import { ResourceOptions } from 'admin-bro'

import { Project } from '../models/entities/Project'

export const projectOptions: ResourceOptions = {
  listProperties: ['userId', 'projectName', 'createdAt', 'updatedAt'],
  filterProperties: ['userId', 'projectName', 'createdAt', 'updatedAt'],
  properties: {
    userId: {
      reference: 'User',
    },
  },
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

export const projectResource = Project
