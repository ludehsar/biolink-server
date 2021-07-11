import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import {
  followUser,
  getFolloweesPaginated,
  getFollowersPaginated,
  unfollowUser,
} from '../../services'
import { MyContext } from '../../types'
import { DefaultResponse, UserConnection } from '../../object-types'
import { ConnectionArgs } from '../../input-types'

@Resolver()
export class FollowResolver {
  @Mutation(() => DefaultResponse)
  async followUser(
    @Arg('followingId', () => String) followingId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await followUser(followingId, user, context)
  }

  @Mutation(() => DefaultResponse)
  async unfollowUser(
    @Arg('followingId', () => String) followingId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await unfollowUser(followingId, user, context)
  }

  @Query(() => UserConnection)
  async getAllFollowers(
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<UserConnection> {
    return await getFollowersPaginated(options, user, context)
  }

  @Query(() => UserConnection)
  async getAllFollowees(
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<UserConnection> {
    return await getFolloweesPaginated(options, user, context)
  }
}
