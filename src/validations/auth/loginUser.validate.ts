import { validate } from 'class-validator'
import argon2 from 'argon2'
import { User } from '../../entities'
import { LoginInput } from '../../input-types'
import { ErrorResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const loginUserValidated = async (options: LoginInput): Promise<ErrorResponse[]> => {
  let errors: ErrorResponse[] = []

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

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    errors.push({
      errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
      message: 'User with this email does not exist',
    })

    return errors
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password as string)

  if (!passwordVerified) {
    errors.push({
      errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
      message: 'Password did not match',
    })
  }

  return errors
}
