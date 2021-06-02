import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { CategoryConnection } from '../../object-types'
import { getCategoriesPaginated } from '../../services'

@Resolver()
export class CategoryAdminResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async getAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
    return await getCategoriesPaginated(options)
  }
}
