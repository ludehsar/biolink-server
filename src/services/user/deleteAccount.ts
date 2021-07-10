import { validate } from 'class-validator'
import argon2 from 'argon2'
import { User } from '../../entities'
import { PasswordInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { logoutUser } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const deleteAccount = async (
  options: PasswordInput,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
  // Validate input
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

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  const isVerified = await argon2.verify(user.encryptedPassword, options.password)

  if (!isVerified) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
          message: 'Password did not match',
        },
      ],
    }
  }

  await logoutUser(context, user)
  await user.softRemove()

  return {}
}
