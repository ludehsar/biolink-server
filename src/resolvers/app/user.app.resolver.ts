import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser, emailVerified } from '../../middlewares'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import {
  EmailAndUsernameInput,
  ChangePasswordInput,
  PasswordInput,
  BillingInput,
  ConnectionArgs,
} from '../../input-types'
import { UserResponse, DefaultResponse, ActivityConnection } from '../../object-types'
import {
  deleteAccount,
  updateBilling,
  changeCurrentBiolinkId,
  getUserActivityPaginated,
} from '../../services'
import { MyContext } from '../../types'
import { UserController } from '../../controllers'

@Resolver(User)
export class UserResolver {
  constructor(private readonly userController: UserController) {}

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async changeUserAccountInfo(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changeUserEmailAddressAndUsername(options, biolinkId, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changePassword(options, context)
  }

  @Mutation(() => DefaultResponse)
  async deleteUserAccount(
    @Arg('options') options: PasswordInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await deleteAccount(options, user, context)
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(emailVerified)
  async updateBilling(
    @Arg('options') options: BillingInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<UserResponse> {
    return await updateBilling(options, user, context)
  }

  @Mutation(() => UserResponse)
  async changeCurrentBiolinkId(
    @Arg('biolinkId', () => String) biolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await changeCurrentBiolinkId(biolinkId, user, context)
  }

  @Query(() => ActivityConnection, { nullable: true })
  async getUserActivity(
    @Arg('options') options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<ActivityConnection> {
    return await getUserActivityPaginated(options, user, context)
  }
}
