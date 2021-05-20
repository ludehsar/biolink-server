import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { BooleanResponse } from '../../typeDefs/common.typeDef'
import {
  createNewBiolink,
  getAllDirectories,
  getBiolinkFromUsername,
  removeBiolinkByUsername,
  updateBiolinkFromUsername,
  updateBiolinkSettingsFromUsername,
} from '../../controllers/biolink.controller'
import { MyContext } from 'MyContext'
import { ConnectionArgs } from '../../typeDefs/relaySpec.typeDef'
import {
  BiolinkResponse,
  NewBiolinkInput,
  UpdateBiolinkProfileInput,
  UpdateBiolinkSettingsInput,
  BiolinkConnection,
} from '../../typeDefs/biolink.typeDef'

@Resolver()
export class BiolinkResolver {
  @Mutation(() => BiolinkResponse)
  async createNewBiolink(
    @Arg('options') options: NewBiolinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createNewBiolink(options, context, user)
  }

  @Query(() => BiolinkResponse)
  async getBiolinkFromUsername(
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await getBiolinkFromUsername(username, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkFromUsername(user, username, options, context)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkSettingsFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkSettingsInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkSettingsFromUsername(user, username, options, context)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryId', { defaultValue: 0 }) categoryId: number
  ): Promise<BiolinkConnection> {
    return await getAllDirectories(categoryId, options)
  }

  @Mutation(() => BooleanResponse)
  async deleteBiolinkByUsername(
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await removeBiolinkByUsername(username, context, user)
  }
}
