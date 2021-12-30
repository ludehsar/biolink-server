import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewBlackListInput } from '../../input-types'
import { BlackList } from '../../entities'
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

  @Query(() => BlackList, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canShow'))
  async getBlackList(@Arg('blackListId') blackListId: string): Promise<BlackList> {
    return await this.blacklistController.getBlackList(blackListId)
  }

  @Mutation(() => BlackList, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canCreate'))
  async addBlackList(@Arg('options') options: NewBlackListInput): Promise<BlackList> {
    return await this.blacklistController.createBlackList(options)
  }

  @Mutation(() => BlackList, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canCreate'))
  async editBlackList(
    @Arg('blackListId') blackListId: string,
    @Arg('options') options: NewBlackListInput
  ): Promise<BlackList> {
    return await this.blacklistController.updateBlackList(blackListId, options)
  }

  @Mutation(() => BlackList, { nullable: true })
  @UseMiddleware(authAdmin('blacklist.canDelete'))
  async deleteBlackList(@Arg('blackListId') blackListId: string): Promise<BlackList> {
    return await this.blacklistController.deleteBlackList(blackListId)
  }
}
