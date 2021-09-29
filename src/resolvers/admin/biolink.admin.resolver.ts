import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'

import { MyContext } from '../../types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgsOld, UpdateBiolinkProfileInput } from '../../input-types'
import { BiolinkConnection, BiolinkResponse, DefaultResponse } from '../../object-types'
import {
  getBiolink,
  getBiolinksPaginated,
  getDirectoriesPaginated,
  removeBiolink,
  updateBiolink,
} from '../../services'

@Resolver()
export class BiolinkAdminResolver {
  @Query(() => BiolinkConnection, { nullable: true })
  async getAllBiolinks(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkConnection> {
    return await getBiolinksPaginated(options, adminUser, context)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgsOld,
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

  @Mutation(() => BiolinkResponse)
  async editBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @Ctx() context: MyContext,
    @CurrentAdmin() adminUser: User
  ): Promise<BiolinkResponse> {
    return await updateBiolink(adminUser, id, options, context)
  }

  @Mutation(() => DefaultResponse)
  async removeBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Ctx() context: MyContext,
    @CurrentAdmin() adminUser: User
  ): Promise<DefaultResponse> {
    return await removeBiolink(id, context, adminUser)
  }
}
