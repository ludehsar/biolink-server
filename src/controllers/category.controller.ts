import { Service } from 'typedi'

import { CategoryService } from '../services/category.service'
import { ConnectionArgs, NewCategoryInput } from '../input-types'
import { PaginatedCategoryResponse } from '../object-types/common/PaginatedCategoryResponse'
import { Category } from '../entities'

@Service()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async getAllCategories(options: ConnectionArgs): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.getCategories(options)
  }

  async getCategory(id: string): Promise<Category> {
    return await this.categoryService.getCategoryByCategoryId(id)
  }

  async createCategory(input: NewCategoryInput): Promise<Category> {
    return await this.categoryService.createCategory({
      categoryName: input.categoryName,
      featured: input.featured,
    })
  }

  async updateCategory(id: string, input: NewCategoryInput): Promise<Category> {
    return await this.categoryService.updateCategoryByCategoryId(id, {
      categoryName: input.categoryName,
      featured: input.featured,
    })
  }

  async deleteCategory(id: string): Promise<Category> {
    return await this.categoryService.softDeleteCategoryByCategoryId(id)
  }
}
