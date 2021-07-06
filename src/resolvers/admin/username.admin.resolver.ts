import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, NewUsernameInput } from '../../input-types'
import { UsernameConnection, UsernameResponse } from '../../object-types'
import {
  addUsername,
  editUsername,
  getPremiumUsernamesPaginated,
  getTrademarkUsernamesPaginated,
  getUsername,
  getUsernamesPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class UsernameAdminResolver {
  @Query(() => UsernameConnection, { nullable: true })
  async getAllUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameConnection> {
    return await getUsernamesPaginated(options, adminUser, context)
  }

  @Query(() => UsernameConnection, { nullable: true })
  async getAllPremiumUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameConnection> {
    return await getPremiumUsernamesPaginated(options, adminUser, context)
  }

  @Query(() => UsernameConnection, { nullable: true })
  async getAllTrademarkUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameConnection> {
    return await getTrademarkUsernamesPaginated(options, adminUser, context)
  }

  @Query(() => UsernameResponse, { nullable: true })
  async getUsername(
    @Arg('usernameId', () => String) usernameId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameResponse> {
    return await getUsername(usernameId, adminUser, context)
  }

  @Mutation(() => UsernameResponse, { nullable: true })
  async addUsername(
    @Arg('options') options: NewUsernameInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameResponse> {
    return await addUsername(options, adminUser, context)
  }

  @Mutation(() => UsernameResponse, { nullable: true })
  async editUsername(
    @Arg('usernameId', () => String) usernameId: string,
    @Arg('options') options: NewUsernameInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<UsernameResponse> {
    return await editUsername(usernameId, options, adminUser, context)
  }
}
