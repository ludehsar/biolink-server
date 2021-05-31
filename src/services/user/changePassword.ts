import { validate } from 'class-validator'
import argon2 from 'argon2'
import { User } from '../../entities'
import { ChangePasswordInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const changePassword = async (
  options: ChangePasswordInput,
  user: User
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

  const isVerified = await argon2.verify(user.encryptedPassword, options.oldPassword)

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

  const encryptedPassword = await argon2.hash(options.newPassword)

  user.encryptedPassword = encryptedPassword

  await user.save()

  return {}
}
