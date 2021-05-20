import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import {
  changeUserEmail,
  changeUserPassword,
  deleteUserAccount,
  loginUser,
  logoutUser,
  registerUser,
  sendEmailForVerification,
  sendForgotPasswordVerificationEmail,
  verifyEmailByActivationCode,
  verifyForgotPassword,
} from '../../controllers/user.controller'
import { BooleanResponse } from '../../typeDefs/common.typeDef'
import CurrentUser from '../../decorators/currentUser'
import {
  RegisterInput,
  UserResponse,
  LoginInput,
  EmailInput,
  ChangePasswordInput,
  PasswordInput,
} from '../../typeDefs/user.typeDef'

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
    @Arg('referralToken') referralToken?: string
  ): Promise<UserResponse> {
    return await registerUser(options, context, referralToken)
  }

  @Mutation(() => BooleanResponse)
  async sendEmailForVerification(
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await sendEmailForVerification(user, context)
  }

  @Mutation(() => BooleanResponse)
  async verifyUserEmailByActivationCode(
    @Arg('emailActivationCode') emailActivationCode: string,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    return await verifyEmailByActivationCode(emailActivationCode, context)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, context)
  }

  @Mutation(() => BooleanResponse)
  async sendForgotPasswordEmail(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    return await sendForgotPasswordVerificationEmail(options, context)
  }

  @Mutation(() => BooleanResponse)
  async verifyForgotPassword(
    @Arg('options') options: LoginInput,
    @Arg('forgotPasswordCode') forgotPasswordCode: string,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    return await verifyForgotPassword(options, forgotPasswordCode, context)
  }

  @Mutation(() => BooleanResponse)
  async changeUserEmailAddress(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await changeUserEmail(options, user, context)
  }

  @Mutation(() => BooleanResponse)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await changeUserPassword(options, user)
  }

  @Mutation(() => BooleanResponse)
  async deleteUserAccount(
    @Arg('options') options: PasswordInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await deleteUserAccount(options, user, context)
  }

  @Mutation(() => BooleanResponse)
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<BooleanResponse> {
    return await logoutUser(context, user)
  }
}
