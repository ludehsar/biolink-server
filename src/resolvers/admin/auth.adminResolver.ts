import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import CurrentAdmin from '../../decorators/currentAdmin'
import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import { BooleanResponse } from '../../typeDefs/common.typeDef'
import { UserResponse, LoginInput, EmailInput } from '../../typeDefs/user.typeDef'
import {
  logoutUser,
  sendForgotPasswordVerificationEmail,
} from '../../controllers/app/user.controller'
import { loginAdminUser } from '../../controllers/admin/auth.adminController'

@Resolver()
export class AuthResolver {
  @Query(() => User, { nullable: true })
  me(@CurrentAdmin() user: User): User | null {
    return user
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginAdminUser(options, context)
  }

  @Mutation(() => BooleanResponse)
  async sendForgotPasswordEmail(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    return await sendForgotPasswordVerificationEmail(options, context)
  }

  @Mutation(() => BooleanResponse)
  async logout(@Ctx() context: MyContext, @CurrentAdmin() user: User): Promise<BooleanResponse> {
    return await logoutUser(context, user)
  }
}
