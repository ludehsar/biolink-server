import { Response } from 'express'
import * as argon2 from 'argon2'

import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { LoginInput, RegisterInput, UserResponse } from '../resolvers/types/user'

export const registerUser = async (options: RegisterInput, res: Response): Promise<UserResponse> => {
  const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegexExp.test(options.email)) {
    return {
      errors: [{
        field: 'email',
        message: 'Email is not valid'
      }]
    }
  }

  if (options.username.length < 3) {
    return {
      errors: [{
        field: 'username',
        message: 'Username must be at least 3 characters'
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
      username: options.username,
      encryptedPassword: hashedPassword
    }).save()

    // Implement jwt
    const { refreshToken, accessToken } = await createAuthTokens(user)

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
            field: 'username',
            message: 'Something went wrong'
          }]
        }
      }
    }
  }
}

export const loginUser = async (options: LoginInput, res: Response): Promise<UserResponse> => {
  const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  let user = null
  if (emailRegexExp.test(options.emailOrUsername)) {
    user = await User.findOne({ where: { email: options.emailOrUsername } })
  } else {
    user = await User.findOne({ where: { username: options.emailOrUsername } })
  }

  if (!user) {
    return {
      errors: [{
        field: 'emailOrUsername',
        message: 'User with this email or username does not exist'
      }]
    }
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password)

  if (!passwordVerified) {
    return {
      errors: [{
        field: 'password',
        message: 'Password did not match'
      }]
    }
  }

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  res.cookie('access_token', accessToken, accessTokenCookieOptions)

  return { user }
}

export const logoutUser = async (res: Response): Promise<Boolean> => {
  return new Promise((resolve) => {
    res.cookie('refresh_token', '', refreshTokenCookieOptions)
    res.cookie('access_token', '', accessTokenCookieOptions)
    resolve(true)
  })
}
