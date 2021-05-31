import { LoginInput, EmailInput } from '../../input-types'
import { Query, Mutation, Arg, Ctx, Resolver } from 'type-graphql'

import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { UserResponse, DefaultResponse } from '../../object-types'
import { loginAdmin, sendForgotPasswordEmail, logoutUser } from '../../services'
import { MyContext } from '../../types'

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
    return await loginAdmin(options, context)
  }

  @Mutation(() => DefaultResponse)
  async sendForgotPasswordEmail(
    @Arg('options') options: EmailInput,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await sendForgotPasswordEmail(options, context)
  }

  @Mutation(() => DefaultResponse)
  async logout(@Ctx() context: MyContext, @CurrentAdmin() user: User): Promise<DefaultResponse> {
    return await logoutUser(context, user)
  }
}
