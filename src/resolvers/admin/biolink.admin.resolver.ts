import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql'

import { MyContext } from '../../types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { BiolinkConnection, BiolinkResponse } from '../../object-types'
import { getBiolink, getBiolinksPaginated, getDirectoriesPaginated } from '../../services'

@Resolver()
export class BiolinkAdminResolver {
  @Query(() => BiolinkConnection, { nullable: true })
  async getAllBiolinks(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkConnection> {
    return await getBiolinksPaginated(options, adminUser, context)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds: number[]
  ): Promise<BiolinkConnection> {
    return await getDirectoriesPaginated(categoryIds, options)
  }

  @Query(() => BiolinkResponse, { nullable: true })
  async getBiolink(
    @Arg('id') id: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkResponse> {
    return await getBiolink(id, adminUser, context)
  }
}
