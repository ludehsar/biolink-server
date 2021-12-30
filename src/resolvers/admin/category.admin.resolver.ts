import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewCategoryInput } from '../../input-types'
import { Category } from '../../entities'
import { CategoryController } from '../../controllers'
import { PaginatedCategoryResponse } from '../../object-types/common/PaginatedCategoryResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class CategoryAdminResolver {
  constructor(private readonly categoryController: CategoryController) {}

  @Query(() => PaginatedCategoryResponse, { nullable: true })
  @UseMiddleware(authAdmin('category.canShowList'))
  async getAllCategories(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedCategoryResponse> {
    return await this.categoryController.getAllCategories(options)
  }

  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(authAdmin('category.canCreate'))
  async createCategory(@Arg('options') options: NewCategoryInput): Promise<Category> {
    return await this.categoryController.createCategory(options)
  }

  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(authAdmin('category.canEdit'))
  async editCategory(
    @Arg('id') id: string,
    @Arg('options') options: NewCategoryInput
  ): Promise<Category> {
    return await this.categoryController.updateCategory(id, options)
  }

  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(authAdmin('category.canDelete'))
  async deleteCategory(@Arg('id') id: string): Promise<Category> {
    return await this.categoryController.deleteCategory(id)
  }

  @Query(() => Category, { nullable: true })
  @UseMiddleware(authAdmin('category.canShow'))
  async getCategory(@Arg('id') id: string): Promise<Category> {
    return await this.categoryController.getCategory(id)
  }
}
