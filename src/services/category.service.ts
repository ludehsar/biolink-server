import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'

import { Category } from '../entities'
import { ErrorCode } from '../types'

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
}
