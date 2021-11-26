import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-errors'

import { Category } from '../entities'
import { ErrorCode } from '../types'
import { PaginatedCategoryResponse } from '../object-types/common/PaginatedCategoryResponse'
import { ConnectionArgs } from '../input-types'

@Service()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  /**
   * Gets category by categoryId
   * @param {number} categoryId
   * @returns {Promise<Category>}
   */
  async getCategoryByCategoryId(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(categoryId)

    if (!category) {
      throw new ApolloError('Category not found', ErrorCode.CATEGORY_COULD_NOT_BE_FOUND)
    }

    return category
  }

  /**
   * Get all categoris
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedUserLogResponse>}
   */
  async getCategories(options: ConnectionArgs): Promise<PaginatedCategoryResponse> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where(`LOWER(category.categoryName) like :query`, {
        query: `%${options.query.toLowerCase()}%`,
      })

    const paginator = buildPaginator({
      entity: Category,
      alias: 'category',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }
}
