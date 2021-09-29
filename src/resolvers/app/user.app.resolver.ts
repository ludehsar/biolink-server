import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser, emailVerified } from '../../middlewares'
import { User } from '../../entities'
import {
  EmailAndUsernameInput,
  ChangePasswordInput,
  PasswordInput,
  BillingInput,
  ConnectionArgs,
} from '../../input-types'
import { MyContext } from '../../types'
import { UserController } from '../../controllers'
import { PaginatedUserLogResponse } from '../../object-types'

@Resolver(User)
export class UserResolver {
  constructor(private readonly userController: UserController) {}

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async changeUserAccountInfo(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changeUserEmailAddressAndUsername(options, biolinkId, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changePassword(options, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async deleteUserAccount(
    @Arg('options') options: PasswordInput,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.deleteUserAccount(options, context)
  }

  @Mutation(() => User)
  @UseMiddleware(authUser, emailVerified)
  async updateBilling(
    @Arg('options') options: BillingInput,
    @Ctx() context: MyContext
  ): Promise<User> {
    return await this.userController.updateBilling(options, context)
  }

  @Mutation(() => User)
  @UseMiddleware(authUser)
  async changeCurrentBiolinkId(
    @Arg('biolinkId', () => String) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<User> {
    return await this.userController.updateCurrentBiolink(biolinkId, context)
  }

  @Query(() => PaginatedUserLogResponse, { nullable: true })
  @UseMiddleware(authUser)
  async getUserNotification(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedUserLogResponse> {
    return await this.userController.getNotification(options, context)
  }
}
