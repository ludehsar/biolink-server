import { validate } from 'class-validator'
import * as argon2 from 'argon2'

import {
  LoginInput,
  RegisterInput,
  UserResponse,
  ValidationResponse,
} from '../resolvers/user.resolver'
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { MyContext } from '../MyContext'
import { newBiolinkValidation } from './biolink.service'
import { NewBiolinkInput } from '../resolvers/biolink.resolver'
import { BlackList } from '../models/entities/BlackList'
import { BlacklistType } from '../models/enums/BlacklistType'

export const validateUserRegistration = async (
  userOptions: RegisterInput,
  biolinkOptions: NewBiolinkInput
): Promise<ValidationResponse> => {
  const userInputValidationReport = await userInputValidation(userOptions)
  if (!userInputValidationReport.passesValidation) {
    return userInputValidationReport
  }

  const biolinkInputValidationReport = await newBiolinkValidation(biolinkOptions)
  if (!biolinkInputValidationReport.passesValidation) {
    return biolinkInputValidationReport
  }

  return { passesValidation: true }
}

export const userInputValidation = async (
  userOptions: RegisterInput
): Promise<ValidationResponse> => {
  // TODO: If new user registration is not enabled

  // Validate input
  const validationErrors = await validate(userOptions)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        message: 'Not correctly formatted',
      })),
      passesValidation: false,
    }
  }

  // Blacklist email checks
  const blacklisted = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Email, keyword: userOptions.email },
  })

  if (blacklisted) {
    return {
      errors: [
        {
          field: 'email',
          message: 'Cannot create new account.',
        },
      ],
      passesValidation: false,
    }
  }

  // Check existing email
  const user = await User.findOne({ where: { email: userOptions.email } })
  if (user) {
    return {
      errors: [
        {
          field: 'email',
          message: 'User with this email address already exists.',
        },
      ],
      passesValidation: false,
    }
  }

  return {
    passesValidation: true,
  }
}

export const registerUser = async (
  userOptions: RegisterInput,
  context: MyContext
): Promise<UserResponse> => {
  // Validating user input
  const userInputValidationReport = await userInputValidation(userOptions)

  if (!userInputValidationReport.passesValidation) {
    return {
      errors: userInputValidationReport.errors,
    }
  }

  // Creating user
  const hashedPassword = await argon2.hash(userOptions.password as string)

  const user = await User.create({
    email: userOptions.email,
    encryptedPassword: hashedPassword,
  }).save()

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  // Email verification mail send

  // Send email to admins, if new user email is checked

  // New user activity logs

  return { user }
}

export const loginUser = async (options: LoginInput, context: MyContext): Promise<UserResponse> => {
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

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          field: 'email',
          message: 'User with this email does not exist',
        },
      ],
    }
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password as string)

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
  user.tokenCode = ''
  await user.save()
  context.res.cookie('refresh_token', '', refreshTokenCookieOptions)
  context.res.cookie('access_token', '', accessTokenCookieOptions)
  return Promise.resolve(true)
}
