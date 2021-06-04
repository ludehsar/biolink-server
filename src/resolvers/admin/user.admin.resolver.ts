import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { DefaultResponse, UserConnection, UserResponse } from '../../object-types'
import { ConnectionArgs, EditUserInput, NewUserInput } from '../../input-types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import {
  addNewUser,
  editUser,
  getAdminsPaginated,
  getUser,
  getUsersPaginated,
} from '../../services'
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

  @Query(() => UserConnection, { nullable: true })
  async getAllAdmins(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() admin: User
  ): Promise<UserConnection> {
    return await getAdminsPaginated(options, admin)
  }

  @Query(() => UserResponse, { nullable: true })
  async getUser(@Arg('id') id: string, @CurrentAdmin() admin: User): Promise<UserConnection> {
    return await getUser(id, admin)
  }

  @Mutation(() => DefaultResponse, { nullable: true })
  async addNewUser(
    @Arg('options') options: NewUserInput,
    @CurrentAdmin() admin: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await addNewUser(options, admin, context)
  }

  @Mutation(() => DefaultResponse, { nullable: true })
  async editUser(
    @Arg('id') id: string,
    @Arg('options') options: EditUserInput,
    @CurrentAdmin() admin: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await editUser(id, options, admin, context)
  }
}
