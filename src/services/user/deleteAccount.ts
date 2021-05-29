import { validate } from 'class-validator'
import argon2 from 'argon2'
import { User } from '../../entities'
import { PasswordInput } from '../../input-types'
import { ErrorResponse } from '../../object-types'
import { logoutUser } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const deleteAccount = async (
  options: PasswordInput,
  user: User,
  context: MyContext
): Promise<ErrorResponse[]> => {
  let errors: ErrorResponse[] = []

  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    errors = errors.concat(
      validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      }))
    )

    return errors
  }

  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })

    return errors
  }

  const isVerified = await argon2.verify(user.encryptedPassword, options.password)

  if (!isVerified) {
    errors.push({
      errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
      message: 'Password did not match',
    })

    return errors
  }

  logoutUser(context, user)

  await user.softRemove()

  return errors
}
