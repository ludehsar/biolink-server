import { ResourceOptions } from 'admin-bro'

import { Category } from '../../../entities'

export const categoryOptions: ResourceOptions = {
  listProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  editProperties: ['categoryName'],
  showProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  filterProperties: ['categoryName', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
    },

    edit: {
      showInDrawer: true,
    },
  },
  properties: {
    categoryName: {
      isTitle: true,
    },
  },
  navigation: {
    icon: 'Category',
  },
}

export const categoryResource = Category
