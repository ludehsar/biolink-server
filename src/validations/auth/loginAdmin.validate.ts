import argon2 from 'argon2'
import { validate } from 'class-validator'
import { User, AdminRole } from '../../entities'
import { LoginInput } from '../../input-types'
import { ErrorResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const loginAdminValidated = async (options: LoginInput): Promise<ErrorResponse[]> => {
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

  if (!user || user.adminRoleId === null) {
    errors.push({
      field: 'email',
      errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
      message: 'User with this email does not exist or do not have admin access',
    })

    return errors
  }

  const adminRole = await AdminRole.findOne(user.adminRoleId)

  if (!adminRole) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHORIZED,
      message: 'User not authorized',
    })

    return errors
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password as string)

  if (!passwordVerified) {
    errors.push({
      field: 'password',
      errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
      message: 'Password did not match',
    })
  }

  return errors
}
