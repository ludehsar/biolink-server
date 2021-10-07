import { Service } from 'typedi'

import { CategoryService } from '../services/category.service'
import { ConnectionArgs } from '../input-types'
import { PaginatedCategoryResponse } from '../object-types/common/PaginatedCategoryResponse'

@Service()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async getAllCategories(options: ConnectionArgs): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.getCategories(options)
  }
}
