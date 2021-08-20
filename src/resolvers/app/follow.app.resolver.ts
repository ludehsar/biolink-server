import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import {
  followBiolink,
  getFolloweesPaginated,
  getIfFollowingBiolink,
  unfollowBiolink,
} from '../../services'
import { MyContext } from '../../types'
import { BiolinkConnection, DefaultResponse, FollowingResponse } from '../../object-types'
import { ConnectionArgs } from '../../input-types'
import { emailVerified } from '../../middlewares'

@Resolver()
export class FollowResolver {
  @Mutation(() => DefaultResponse)
  @UseMiddleware(emailVerified)
  async followBiolink(
    @Arg('followingBiolinkId', () => String) followingBiolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await followBiolink(followingBiolinkId, user, context)
  }

  @Mutation(() => DefaultResponse)
  @UseMiddleware(emailVerified)
  async unfollowBiolink(
    @Arg('followingBiolinkId', () => String) followingBiolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await unfollowBiolink(followingBiolinkId, user, context)
  }

  @Query(() => BiolinkConnection)
  async getAllFollowings(
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkConnection> {
    return await getFolloweesPaginated(options, user, context)
  }

  @Query(() => FollowingResponse)
  async getIfFollowing(
    @Arg('biolinkId', () => String) biolinkId: string,
    @CurrentUser() user: User
  ): Promise<FollowingResponse> {
    return await getIfFollowingBiolink(biolinkId, user)
  }
}
