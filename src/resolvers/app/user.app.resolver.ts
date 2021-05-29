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
} from '../../input-types'
import { UserResponse, ErrorResponse } from '../../object-types'
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
} from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@CurrentUser() user: User): User | null {
    return user
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext,
    @Arg('referralToken', { nullable: true }) referralToken?: string
  ): Promise<UserResponse> {
    return await registerUser(options, context, referralToken)
  }

  @Mutation(() => [ErrorResponse])
  async sendEmailForVerification(
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ErrorResponse[]> {
    return await sendVerificationEmail(user, context)
  }

  @Mutation(() => [ErrorResponse])
  async verifyUserEmailByActivationCode(
    @Arg('emailActivationCode') emailActivationCode: string,
    @Ctx() context: MyContext
  ): Promise<ErrorResponse[]> {
    return await verifyEmailActivationToken(emailActivationCode, context)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, context)
  }

  @Mutation(() => [ErrorResponse])
  async sendForgotPasswordEmail(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext
  ): Promise<ErrorResponse[]> {
    return await sendForgotPasswordEmail(options, context)
  }

  @Mutation(() => [ErrorResponse])
  async verifyForgotPassword(
    @Arg('options') options: LoginInput,
    @Arg('forgotPasswordCode') forgotPasswordCode: string,
    @Ctx() context: MyContext
  ): Promise<ErrorResponse[]> {
    return await verifyForgotPasswordToken(options, forgotPasswordCode, context)
  }

  @Mutation(() => [ErrorResponse])
  async changeUserAccountInfoByUsername(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ErrorResponse[]> {
    return await changeEmailAndUsername(options, username, user, context)
  }

  @Mutation(() => [ErrorResponse])
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @CurrentUser() user: User
  ): Promise<ErrorResponse[]> {
    return await changePassword(options, user)
  }

  @Mutation(() => [ErrorResponse])
  async deleteUserAccount(
    @Arg('options') options: PasswordInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ErrorResponse[]> {
    return await deleteAccount(options, user, context)
  }

  @Mutation(() => [ErrorResponse])
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<ErrorResponse[]> {
    return await logoutUser(context, user)
  }
}
