import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgsOld } from '../../input-types'
import { CategoryConnection } from '../../object-types'
import { getCategoriesPaginated } from '../../services'

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async fetchAllCategories(
    @Arg('options') options: ConnectionArgsOld
  ): Promise<CategoryConnection> {
    return await getCategoriesPaginated(options)
  }
}
