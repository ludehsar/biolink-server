import { Arg, Int, Query, Resolver } from 'type-graphql'

import { ConnectionArgs } from '../../input-types'
import { BiolinkConnection } from '../../object-types'
import { getBiolinksPaginated, getDirectoriesPaginated } from '../../services'

@Resolver()
export class BiolinkAdminResolver {
  @Query(() => BiolinkConnection, { nullable: true })
  async getAllBiolinks(@Arg('options') options: ConnectionArgs): Promise<BiolinkConnection> {
    return await getBiolinksPaginated(options)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds: number[]
  ): Promise<BiolinkConnection> {
    return await getDirectoriesPaginated(categoryIds, options)
  }
}
