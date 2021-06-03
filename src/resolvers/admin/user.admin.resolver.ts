import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { DefaultResponse, UserConnection } from '../../object-types'
import { ConnectionArgs, NewUserInput } from '../../input-types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { addNewUser, getUsersPaginated } from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class UserAdminResolver {
  @Query(() => UserConnection, { nullable: true })
  async getAllUsers(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() admin: User
  ): Promise<UserConnection> {
    return await getUsersPaginated(options, admin)
  }

  @Mutation(() => DefaultResponse, { nullable: true })
  async addNewUser(
    @Arg('options') options: NewUserInput,
    @CurrentAdmin() admin: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await addNewUser(options, admin, context)
  }
}
