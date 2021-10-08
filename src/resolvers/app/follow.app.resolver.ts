import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { Follow } from '../../entities'
import { MyContext } from '../../types'
import { ConnectionArgs } from '../../input-types'
import { authUser } from '../../middlewares'
import { FollowController } from '../../controllers'
import { PaginatedBiolinkResponse } from '../../object-types/common/PaginatedBiolinkResponse'

@Resolver()
export class FollowResolver {
  constructor(private readonly followController: FollowController) {}

  @Mutation(() => Follow)
  @UseMiddleware(authUser)
  async followBiolink(
    @Arg('followingBiolinkId', () => String) followingBiolinkId: string,
    @Ctx() context: MyContext
  ): Promise<Follow> {
    return await this.followController.followBiolink(followingBiolinkId, context)
  }

  @Mutation(() => Follow)
  @UseMiddleware(authUser)
  async unfollowBiolink(
    @Arg('followingBiolinkId', () => String) followingBiolinkId: string,
    @Ctx() context: MyContext
  ): Promise<Follow> {
    return await this.followController.unfollowBiolink(followingBiolinkId, context)
  }

  @Query(() => PaginatedBiolinkResponse)
  @UseMiddleware(authUser)
  async getAllFollowings(
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedBiolinkResponse> {
    return await this.followController.getFollowingBiolinks(options, context)
  }

  @Query(() => Boolean)
  @UseMiddleware(authUser)
  async getIfFollowing(
    @Arg('biolinkId', () => String) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<boolean> {
    return await this.followController.getFollowingStatus(biolinkId, context)
  }
}
