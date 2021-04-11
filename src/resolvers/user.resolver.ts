import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import * as argon2 from 'argon2'

import { User } from '../models/entities/User'
import { UserResponse, LoginInput } from './types/user'
import { MyContext } from '../MyContext'
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config'
import { createAuthTokens } from '../utils/createAuthTokens'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me (@Ctx() { req }: MyContext) {
    if (!(req as any).userId) {
      return null
    }

    return await User.findOne((req as any).userId)
  }

  @Mutation(() => UserResponse)
  async register (
      @Arg('options') options: LoginInput, @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegexExp.test(options.email)) {
      return {
        errors: [{
          field: 'email',
          message: 'Email is not valid'
        }]
      }
    }

    if (options.password.length < 8) {
      return {
        errors: [{
          field: 'password',
          message: 'Password must be at least 8 characters'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)

    try {
      const user = await User.create({
        email: options.email,
        encryptedPassword: hashedPassword
      }).save()

      // Implement jwt
      const { refreshToken, accessToken } = createAuthTokens(user)

      res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
      res.cookie('access_token', accessToken, accessTokenCookieOptions)

      return { user }
    } catch (err) {
      console.log(err)
      switch (err.constraint) {
        case 'UQ_e12875dfb3b1d92d7d7c5377e22': {
          return {
            errors: [{
              field: 'email',
              message: 'User with this email already exists'
            }]
          }
        }
        default: {
          return {
            errors: [{
              field: 'email',
              message: 'Something went wrong'
            }]
          }
        }
      }
    }
  }

  @Mutation(() => UserResponse)
  async login (
      @Arg('options') options: LoginInput, @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: options.email } })

    if (!user) {
      return {
        errors: [{
          field: 'email',
          message: 'User with this email did not found'
        }]
      }
    }

    const passwordVerified = argon2.verify(user.encryptedPassword, options.password)

    if (!passwordVerified) {
      return {
        errors: [{
          field: 'password',
          message: 'Password did not match'
        }]
      }
    }

    // Implement jwt
    const { refreshToken, accessToken } = createAuthTokens(user)

    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
    res.cookie('access_token', accessToken, accessTokenCookieOptions)

    return { user }
  }

  @Mutation(() => Boolean)
  async verifyEmail (): Promise<Boolean> {
    // TODO: implement email verification
    return true
  }

  @Mutation(() => Boolean)
  async forgotPassword (): Promise<Boolean> {
    // TODO: implement forgot password
    return true
  }

  @Mutation(() => Boolean)
  async changePassword (): Promise<Boolean> {
    // TODO: implement change password
    return true
  }

  @Mutation(() => Boolean)
  logout (@Ctx() { res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      res.cookie('refresh_token', '', refreshTokenCookieOptions)
      res.cookie('access_token', '', accessTokenCookieOptions)
      resolve(true)
    })
  }
}
