import { User } from 'entities'
import { validate } from 'class-validator'
import { LoginInput } from 'input-types'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'
import randToken from 'rand-token'
import argon2 from 'argon2'

export const verifyForgotPasswordToken = async (
  options: LoginInput,
  forgotPasswordCode: string,
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

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    errors.push({
      errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
      message: 'Invalid email address',
    })

    return errors
  }

  if (forgotPasswordCode === null || forgotPasswordCode === '') {
    errors.push({
      errorCode: ErrorCode.INVALID_TOKEN,
      message: 'Invalid forgot password code',
    })

    return errors
  }

  const verified = await argon2.verify(user.forgotPasswordCode, forgotPasswordCode)

  if (!verified) {
    errors.push({
      errorCode: ErrorCode.INVALID_TOKEN,
      message: 'Invalid token',
    })

    return errors
  }

  // Saving user password and resetting forgotPasswordCode
  const newForgotPasswordCode = randToken.generate(160)

  user.encryptedPassword = await argon2.hash(options.password)
  user.forgotPasswordCode = await argon2.hash(newForgotPasswordCode)
  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'Password has been reset successfully')

  return errors
}
