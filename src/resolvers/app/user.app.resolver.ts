import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser, emailVerified } from '../../middlewares'
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
  changeEmailAndUsername,
  changePassword,
  deleteAccount,
  updateBilling,
  changeCurrentBiolinkId,
  getUserActivityPaginated,
} from '../../services'
import { MyContext } from '../../types'
import { AuthController } from '../../controllers'
import { AccessAndRefreshToken } from '../../object-types/auth/AccessAndRefreshToken'

@Resolver(User)
export class UserResolver {
  constructor(private readonly authController: AuthController) {}

  @Query(() => User, { nullable: true })
  @UseMiddleware(authUser)
  me(@Ctx() context: MyContext): User | null {
    if (context.user) return context.user
    return null
  }

  @Mutation(() => UserWithTokens)
  async registerUser(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.register(options, context)
  }

  @Mutation(() => UserWithTokens)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.login(options, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() context: MyContext): Promise<void> {
    return await this.authController.logout(context)
  }

  @Mutation(() => AccessAndRefreshToken)
  async refreshToken(@Ctx() context: MyContext): Promise<AccessAndRefreshToken> {
    return await this.authController.refreshToken(context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async sendForgotPasswordEmail(@Arg('options') options: EmailInput): Promise<void> {
    return await this.authController.forgotPassword(options.email)
  }

  @Mutation(() => Boolean, { nullable: true })
  async verifyForgotPassword(
    @Arg('options') options: PasswordInput,
    @Arg('forgotPasswordToken') forgotPasswordToken: string
  ): Promise<void> {
    return await this.authController.resetPassword(forgotPasswordToken, options.password)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async sendEmailForVerification(@Ctx() context: MyContext): Promise<void> {
    return await this.authController.sendVerificationEmail(context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async verifyUserEmailByActivationCode(
    @Arg('emailActivationCode') emailActivationCode: string
  ): Promise<void> {
    return await this.authController.verifyEmail(emailActivationCode)
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
}
