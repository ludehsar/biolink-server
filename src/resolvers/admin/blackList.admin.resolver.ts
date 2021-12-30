import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewBlackListInput } from '../../input-types'
import { BlackListResponse } from '../../object-types'
import { addBlackList, editBlackList, getBlackList } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'
import { BlackListController } from '../../controllers'
import { PaginatedBlackListResponse } from '../../object-types/common/PaginatedBlackListResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class BlackListAdminResolver {
  constructor(private readonly blacklistController: BlackListController) {}

  @Query(() => PaginatedBlackListResponse, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canShowList'))
  async getAllBlackListedBadWords(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedBlackListResponse> {
    return await this.blacklistController.getAllBadWords(options)
  }

  @Query(() => PaginatedBlackListResponse, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canShowList'))
  async getAllBlackListedEmails(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedBlackListResponse> {
    return await this.blacklistController.getAllBlacklistedEmails(options)
  }

  @Query(() => PaginatedBlackListResponse, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canShowList'))
  async getAllBlackListedUsernames(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedBlackListResponse> {
    return await this.blacklistController.getAllBlacklistedUsernames(options)
  }

  @Query(() => BlackListResponse, { nullable: true })
  async getBlackList(
    @Arg('blackListId') blackListId: number,
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
    @Arg('blackListId', () => Int) blackListId: number,
    @Arg('options') options: NewBlackListInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListResponse> {
    return await editBlackList(blackListId, options, adminUser, context)
  }
}
