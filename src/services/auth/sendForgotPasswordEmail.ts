import randToken from 'rand-token'
import argon2 from 'argon2'
import { MailDataRequired } from '@sendgrid/mail'
import { FRONTEND_APP_URL } from 'config'
import { User } from 'entities'
import { validate } from 'class-validator'
import { EmailInput } from 'input-types'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'
import { sgMail } from 'utilities'

export const sendForgotPasswordEmail = async (
  options: EmailInput,
  context: MyContext
): Promise<ErrorResponse[]> => {
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
      message: 'Invalid email address',
    })

    return errors
  }

  const forgotPasswordCode = randToken.generate(160)

  user.forgotPasswordCode = await argon2.hash(forgotPasswordCode)
  await user.save()

  const forgetPasswordMailData: MailDataRequired = {
    to: {
      email: user.email,
    },
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Reset Your Stashee Password`,
    html: `Click <a href="${FRONTEND_APP_URL}/auth/reset_password?email=${user.email}&token=${forgotPasswordCode}" target="_blank">here</a> to reset your Stashee Password.`,
  }

  await sgMail.send(forgetPasswordMailData, false, (err) => {
    errors.push({
      errorCode: ErrorCode.DATABASE_ERROR,
      message: err.message,
    })
  })

  // Capture user log
  await captureUserActivity(user, context, 'Requested Forgot Password Verification Email')

  return errors
}
