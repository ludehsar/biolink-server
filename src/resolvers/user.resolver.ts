import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { User } from '../models/entities/User'
import { UserResponse, LoginInput, RegisterInput } from './types/user'
import { MyContext } from '../MyContext'
import checkAuth from '../middlewares/checkAuth'
import { loginUser, logoutUser, registerUser } from '../services/user.service'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(checkAuth)
  async me(@Ctx() { req }: MyContext): Promise<User | undefined | null> {
    if (!(req as any).userId) {
      return null
    }

    return await User.findOne((req as any).userId)
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    return await registerUser(options, res)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, res)
  }

  // @Mutation(() => Boolean)
  // async verifyEmail (): Promise<Boolean> {
  //   // TODO: implement email verification
  //   return true
  // }

  // @Mutation(() => Boolean)
  // async forgotPassword (): Promise<Boolean> {
  //   // TODO: implement forgot password
  //   return true
  // }

  // @Mutation(() => Boolean)
  // async changePassword (): Promise<Boolean> {
  //   // TODO: implement change password
  //   return true
  // }

  @Mutation(() => Boolean)
  @UseMiddleware(checkAuth)
  async logout(@Ctx() { res }: MyContext): Promise<boolean> {
    return await logoutUser(res)
  }
}
