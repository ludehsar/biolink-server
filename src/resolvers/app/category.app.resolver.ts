import { Arg, Query, Resolver } from 'type-graphql'
import { CategoryController } from '../../controllers'
import { ConnectionArgs } from '../../input-types'
import { PaginatedCategoryResponse } from '../../object-types/common/PaginatedCategoryResponse'

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryController: CategoryController) {}

  @Query(() => PaginatedCategoryResponse, { nullable: true })
  async getAllCategories(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedCategoryResponse> {
    return await this.categoryController.getAllCategories(options)
  }
}
