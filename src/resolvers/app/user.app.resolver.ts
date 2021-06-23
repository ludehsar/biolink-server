import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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
} from '../../input-types'
import { UserResponse, DefaultResponse, AccessTokenResponse } from '../../object-types'
import {
  registerUser,
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
  getAccessToken,
} from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@CurrentUser() user: User): User | null {
    return user
  }

  @Query(() => AccessTokenResponse)
  async getAccessToken(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<AccessTokenResponse> {
    return await getAccessToken(user, context)
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext,
    @Arg('referralToken', { nullable: true }) referralToken?: string
  ): Promise<UserResponse> {
    return await registerUser(options, context, referralToken)
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
  async changeUserAccountInfoByUsername(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await changeEmailAndUsername(options, username, user, context)
  }

  @Mutation(() => DefaultResponse)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await changePassword(options, user)
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
  async updateBilling(
    @Arg('options') options: BillingInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<UserResponse> {
    return await updateBilling(options, user, context)
  }

  @Mutation(() => DefaultResponse)
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<DefaultResponse> {
    return await logoutUser(context, user)
  }
}
