import { Arg, Query, Resolver } from 'type-graphql'

import { CategoryConnection } from '../../typeDefs/category.typeDef'
import { getAllCateogories } from '../../controllers/category.controller'
import { ConnectionArgs } from '../../typeDefs/relaySpec.typeDef'

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async fetchAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
    return await getAllCateogories(options)
  }
}
