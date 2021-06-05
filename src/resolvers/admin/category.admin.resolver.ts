import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, NewCategoryInput } from '../../input-types'
import { CategoryConnection, CategoryResponse } from '../../object-types'
import { addCategory, editCategory, getCategoriesPaginated, getCategory } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class CategoryAdminResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async getAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
    return await getCategoriesPaginated(options)
  }

  @Mutation(() => CategoryResponse, { nullable: true })
  async createCategory(
    @Arg('options') options: NewCategoryInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CategoryResponse> {
    return await addCategory(options, adminUser, context)
  }

  @Mutation(() => CategoryResponse, { nullable: true })
  async editCategory(
    @Arg('id', () => Int) id: number,
    @Arg('options') options: NewCategoryInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CategoryResponse> {
    return await editCategory(id, options, adminUser, context)
  }

  @Query(() => CategoryResponse, { nullable: true })
  async getCategory(@Arg('id', () => Int) id: number): Promise<CategoryResponse> {
    return await getCategory(id)
  }
}
