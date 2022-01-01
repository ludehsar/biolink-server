import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { UserTotalCountsResponse } from '../../object-types'
import { ConnectionArgs, NewUserInput } from '../../input-types'
import { User } from '../../entities'
import { UserController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { PaginatedUserResponse } from '../../object-types/common/PaginatedUserResponse'

@Resolver()
export class UserAdminResolver {
  constructor(private readonly userController: UserController) {}

  @Query(() => PaginatedUserResponse, { nullable: true })
  @UseMiddleware(authAdmin('user.canShowList'))
  async getAllUsers(@Arg('options') options: ConnectionArgs): Promise<PaginatedUserResponse> {
    return await this.userController.getAllUsers(options)
  }

  @Query(() => PaginatedUserResponse, { nullable: true })
  @UseMiddleware(authAdmin('user.canShowList'))
  async getAllAdmins(@Arg('options') options: ConnectionArgs): Promise<PaginatedUserResponse> {
    return await this.userController.getAllAdmins(options)
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(authAdmin('user.canShow'))
  async getUser(@Arg('id') id: string): Promise<User> {
    return await this.userController.getUserByAdmins(id)
  }

  @Query(() => UserTotalCountsResponse, { nullable: true })
  @UseMiddleware(authAdmin('user.canShow'))
  async getUserSummaryCounts(@Arg('userId') userId: string): Promise<UserTotalCountsResponse> {
    return await this.userController.getUserSummaryCounts(userId)
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(authAdmin('user.canCreate'))
  async addNewUser(@Arg('options') options: NewUserInput): Promise<User> {
    return await this.userController.createUserByAdmins(options)
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(authAdmin('user.canEdit'))
  async editUser(@Arg('id') id: string, @Arg('options') options: NewUserInput): Promise<User> {
    return await this.userController.updateUserByAdmins(id, options)
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(authAdmin('user.canDelete'))
  async deleteUser(@Arg('id') id: string): Promise<User> {
    return await this.userController.deleteUserByAdmins(id)
  }
}
