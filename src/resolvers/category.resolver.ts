import { Arg, Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { Category } from '../models/entities/Category'

@Resolver()
export class CategoryResolver {
  @Query(() => [Category], { nullable: true })
  async fetchAllCategories(@Arg('categoryName') categoryName: string): Promise<Category[]> {
    const categories = await getRepository(Category)
      .createQueryBuilder('category')
      .where('LOWER(category.categoryName) like :categoryName', {
        categoryName: `%${categoryName.toLowerCase()}%`,
      })
      .orderBy('category.categoryName', 'ASC')
      .limit(5)
      .getMany()

    return categories
  }
}
