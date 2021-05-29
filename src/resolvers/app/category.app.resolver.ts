import { ConnectionArgs } from 'input-types'
import { CategoryConnection } from 'object-types'
import { getAllCateogories } from 'services'
import { Arg, Query, Resolver } from 'type-graphql'

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async fetchAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
    return await getAllCateogories(options)
  }
}
