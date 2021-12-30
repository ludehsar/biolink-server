import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-errors'

import { Category } from '../entities'
import { ErrorCode } from '../types'
import { PaginatedCategoryResponse } from '../object-types/common/PaginatedCategoryResponse'
import { ConnectionArgs } from '../input-types'
import { CategoryUpdateBody } from '../interfaces/CategoryUpdateBody'

@Service()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  /**
   * Gets category by categoryId
   * @param {string} categoryId
   * @returns {Promise<Category>}
   */
  async getCategoryByCategoryId(categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne(categoryId)

    if (!category) {
      throw new ApolloError('Category not found', ErrorCode.CATEGORY_COULD_NOT_BE_FOUND)
    }

    return category
  }

  /**
   * Create category
   * @param {CategoryUpdateBody} updateBody
   * @returns {Promise<Category>}
   */
  async createCategory(updateBody: CategoryUpdateBody): Promise<Category> {
    let category = await this.categoryRepository.create().save()

    category = await this.updateCategoryByCategoryId(category.id, updateBody)

    return category
  }

  /**
   * Update category by categoryId
   * @param {string} categoryId
   * @param {CategoryUpdateBody} updateBody
   * @returns {Promise<Category>}
   */
  async updateCategoryByCategoryId(
    categoryId: string,
    updateBody: CategoryUpdateBody
  ): Promise<Category> {
    const category = await this.getCategoryByCategoryId(categoryId)

    if (updateBody.categoryName !== undefined) category.categoryName = updateBody.categoryName
    if (updateBody.featured !== undefined) category.featured = updateBody.featured

    await category.save()

    return category
  }

  /**
   * Delete category by category id
   * @param {string} categoryId
   * @returns {Promise<Category>}
   */
  async softDeleteCategoryByCategoryId(categoryId: string): Promise<Category> {
    const category = await this.getCategoryByCategoryId(categoryId)

    await category.softRemove()

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
