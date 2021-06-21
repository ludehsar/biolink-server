import { Arg, Int, Query, Resolver } from 'type-graphql'

import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { BiolinkConnection } from '../../object-types'
import { getBiolinksPaginated, getDirectoriesPaginated } from '../../services'

@Resolver()
export class BiolinkAdminResolver {
  @Query(() => BiolinkConnection, { nullable: true })
  async getAllBiolinks(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<BiolinkConnection> {
    return await getBiolinksPaginated(options, adminUser)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds: number[]
  ): Promise<BiolinkConnection> {
    return await getDirectoriesPaginated(categoryIds, options)
  }
}
