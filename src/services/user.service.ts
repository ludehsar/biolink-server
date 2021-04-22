import { validate } from 'class-validator'
import * as argon2 from 'argon2'

import { LoginInput, RegisterInput, UserResponse } from '../resolvers/user.resolver'
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { MyContext } from '../MyContext'
import { Category } from '../models/entities/Category'
import { Biolink } from '../models/entities/Biolink'
import { createNewBiolink } from './biolink.service'
import { BiolinkInput } from '../resolvers/biolink.resolver'

export const registerUser = async (
  options: RegisterInput,
  context: MyContext
): Promise<UserResponse> => {
  // Predefined validation errors
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        message: 'Not correctly formatted',
      })),
    }
  }

  // Category not found
  const category = await Category.findOne({ where: { id: options.categoryId } })

  if (!category) {
    return {
      errors: [
        {
          field: 'categoryId',
          message: 'Category not found',
        },
      ],
    }
  }

  // Username already in use
  const biolink = await Biolink.findOne({ where: { username: options.username } })

  if (biolink) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Username already in use',
        },
      ],
    }
  }

  const hashedPassword = await argon2.hash(options.password)

  try {
    const user = await User.create({
      email: options.email,
      encryptedPassword: hashedPassword,
    }).save()

    const biolinkRes = await createNewBiolink(
      { categoryId: options.categoryId, username: options.username } as BiolinkInput,
      user
    )

    if (biolinkRes.errors) {
      await user.remove()
      return { errors: biolinkRes.errors }
    }

    // Implement jwt
    const { refreshToken, accessToken } = await createAuthTokens(user)

    context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
    context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

    return { user }
  } catch (err) {
    switch (err.constraint) {
      case 'UQ_e12875dfb3b1d92d7d7c5377e22': {
        return {
          errors: [
            {
              field: 'email',
              message: 'User with this email already exists',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
              field: 'email',
              message: 'Something went wrong',
            },
          ],
        }
      }
    }
  }
}

export const loginUser = async (options: LoginInput, context: MyContext): Promise<UserResponse> => {
  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          field: 'email',
          message: 'User with this email or username does not exist',
        },
      ],
    }
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password)

  if (!passwordVerified) {
    return {
      errors: [
        {
          field: 'password',
          message: 'Password did not match',
        },
      ],
    }
  }

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  return { user }
}

export const logoutUser = async (context: MyContext, user: User): Promise<boolean> => {
  if (!user) return Promise.resolve(false)
  return new Promise((resolve) => {
    context.res.cookie('refresh_token', '', refreshTokenCookieOptions)
    context.res.cookie('access_token', '', accessTokenCookieOptions)
    resolve(true)
  })
}
