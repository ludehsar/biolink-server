import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { emailVerified } from '../../middlewares'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import {
  RegisterInput,
  LoginInput,
  EmailInput,
  EmailAndUsernameInput,
  ChangePasswordInput,
  PasswordInput,
  BillingInput,
  ConnectionArgs,
} from '../../input-types'
import {
  UserResponse,
  DefaultResponse,
  ActivityConnection,
  UserWithTokens,
} from '../../object-types'
import {
  sendVerificationEmail,
  verifyEmailActivationToken,
  loginUser,
  sendForgotPasswordEmail,
  verifyForgotPasswordToken,
  changeEmailAndUsername,
  changePassword,
  deleteAccount,
  logoutUser,
  updateBilling,
  changeCurrentBiolinkId,
  getUserActivityPaginated,
} from '../../services'
import { MyContext } from '../../types'
import { AuthController } from '../../controllers'

@Resolver(User)
export class UserResolver {
  constructor(private readonly authController: AuthController) {}
  @Query(() => User, { nullable: true })
  me(@CurrentUser() user: User): User | null {
    return user
  }

  @Mutation(() => UserWithTokens)
  async registerUser(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.register(options, context)
  }

  @Mutation(() => DefaultResponse)
  async sendEmailForVerification(
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await sendVerificationEmail(user, context)
  }

  @Mutation(() => DefaultResponse)
  async verifyUserEmailByActivationCode(
    @Arg('emailActivationCode') emailActivationCode: string,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await verifyEmailActivationToken(emailActivationCode, context)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, context)
  }

  @Mutation(() => DefaultResponse)
  async sendForgotPasswordEmail(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await sendForgotPasswordEmail(options, context)
  }

  @Mutation(() => DefaultResponse)
  async verifyForgotPassword(
    @Arg('options') options: LoginInput,
    @Arg('forgotPasswordCode') forgotPasswordCode: string,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await verifyForgotPasswordToken(options, forgotPasswordCode, context)
  }

  @Mutation(() => DefaultResponse)
  @UseMiddleware(emailVerified)
  async changeUserAccountInfo(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await changeEmailAndUsername(options, biolinkId, user, context)
  }

  @Mutation(() => DefaultResponse)
  @UseMiddleware(emailVerified)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await changePassword(options, user, context)
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

  @Mutation(() => DefaultResponse)
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<DefaultResponse> {
    return await logoutUser(context, user)
  }
}
