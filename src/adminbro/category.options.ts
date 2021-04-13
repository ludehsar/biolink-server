import { ResourceOptions } from 'admin-bro'

import { Category } from '../models/entities/Category'

export const categoryOptions: ResourceOptions = {
  listProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  editProperties: ['categoryName'],
  showProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  filterProperties: ['id', 'categoryName', 'createdAt', 'updatedAt'],
  actions: {
    new: {
      showInDrawer: true,
    },
    show: {
      showInDrawer: true,
    },
    edit: {
      showInDrawer: true,
    },
  },
  navigation: {
    icon: 'Category',
  },
}

export const categoryResource = Category
