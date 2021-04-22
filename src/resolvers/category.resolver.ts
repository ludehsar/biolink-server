import { GraphQLResolveInfo } from 'graphql'
import { Arg, Field, Info, InputType, Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { Category } from '../models/entities/Category'
import { doesPathExist } from '../utils/checkPathExists'

@InputType()
export class CategoryInput {
  @Field(() => String)
  categoryName = ''
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category], { nullable: true })
  async fetchAllCategories(
    @Arg('options') options: CategoryInput,
    @Info() info: GraphQLResolveInfo
  ): Promise<Category[]> {
    const shouldJoinBiolinksTable = doesPathExist(info.fieldNodes, [
      'fetchAllCategories',
      'biolinks',
    ])

    const categories = await getRepository(Category)
      .createQueryBuilder('category')
      .where('LOWER(category.categoryName) like :categoryName', {
        categoryName: `%${options.categoryName.toLowerCase()}%`,
      })
      .limit(5)

    if (shouldJoinBiolinksTable) {
      categories.leftJoinAndSelect('category.biolinks', 'biolink')
    }

    return categories.getMany()
  }
}
