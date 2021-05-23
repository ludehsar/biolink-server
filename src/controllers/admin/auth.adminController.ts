import { validate } from 'class-validator'
import * as argon2 from 'argon2'

import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../../config/cookie.config'
import { ErrorCode } from '../../constants/errorCodes'
import { captureUserActivity } from '../app/logs.controller'
import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import { LoginInput, UserResponse } from '../../typeDefs/user.typeDef'
import { createAuthTokens } from '../../utils/createAuthTokens'
import { AdminRole } from '../../models/entities/AdminRole'

export const loginAdminUser = async (
  options: LoginInput,
  context: MyContext
): Promise<UserResponse> => {
  // Predefined validation errors
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  const user = await User.findOne({ where: { email: options.email } })

  if (!user || user.adminRoleId === null) {
    return {
      errors: [
        {
          field: 'email',
          errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
          message: 'User with this email does not exist or do not have admin access',
        },
      ],
    }
  }

  const adminRole = await AdminRole.findOne(user.adminRoleId)

  if (!adminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
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
          errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
          message: 'Password did not match',
        },
      ],
    }
  }

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  user.totalLogin++

  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'User logs in')

  return { user }
}
