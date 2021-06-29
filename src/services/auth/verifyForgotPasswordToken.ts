import argon2 from 'argon2'
import randToken from 'rand-token'
import { validate } from 'class-validator'
import { User } from '../../entities'
import { LoginInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const verifyForgotPasswordToken = async (
  options: LoginInput,
  forgotPasswordCode: string,
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

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
          message: 'Invalid email address',
        },
      ],
    }
  }

  if (forgotPasswordCode === null || forgotPasswordCode === '') {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid forgot password code',
        },
      ],
    }
  }

  const verified = await argon2.verify(user.forgotPasswordCode, forgotPasswordCode)

  if (!verified) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid token',
        },
      ],
    }
  }

  // Saving user password and resetting forgotPasswordCode
  const newForgotPasswordCode = randToken.generate(160)

  user.encryptedPassword = await argon2.hash(options.password)
  user.forgotPasswordCode = await argon2.hash(newForgotPasswordCode)
  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'Password has been reset successfully', true)

  return {}
}
