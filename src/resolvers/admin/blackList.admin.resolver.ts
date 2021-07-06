import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, NewBlackListInput } from '../../input-types'
import { BlackListConnection, BlackListResponse } from '../../object-types'
import {
  addBlackList,
  editBlackList,
  getBlackList,
  getBlackListedBadWordsPaginated,
  getBlackListedEmailsPaginated,
  getBlackListedUsernamesPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class BlackListAdminResolver {
  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedBadWords(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedBadWordsPaginated(options, adminUser, context)
  }

  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedEmails(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedEmailsPaginated(options, adminUser, context)
  }

  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedUsernamesPaginated(options, adminUser, context)
  }

  @Query(() => BlackListResponse, { nullable: true })
  async getBlackList(
    @Arg('blackListId', () => String) blackListId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListResponse> {
    return await getBlackList(blackListId, adminUser, context)
  }

  @Mutation(() => BlackListResponse, { nullable: true })
  async addBlackList(
    @Arg('options') options: NewBlackListInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListResponse> {
    return await addBlackList(options, adminUser, context)
  }

  @Mutation(() => BlackListResponse, { nullable: true })
  async editBlackList(
    @Arg('blackListId', () => String) blackListId: string,
    @Arg('options') options: NewBlackListInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListResponse> {
    return await editBlackList(blackListId, options, adminUser, context)
  }
}
