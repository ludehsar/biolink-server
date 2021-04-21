import { Arg, Field, InputType, Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { Category } from '../models/entities/Category'

@InputType()
export class CategoryInput {
  @Field(() => String)
  categoryName = ''
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category], { nullable: true })
  async fetchAllCategories(@Arg('options') options: CategoryInput): Promise<Category[]> {
    const categories = await getRepository(Category)
      .createQueryBuilder('category')
      .where('LOWER(category.categoryName) like :categoryName', {
        categoryName: `%${options.categoryName.toLowerCase()}%`,
      })
      .leftJoinAndSelect('category.biolinks', 'biolink')
      .limit(5)
      .getMany()

    return categories
  }
}
