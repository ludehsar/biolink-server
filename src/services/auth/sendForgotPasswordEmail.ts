import randToken from 'rand-token'
import argon2 from 'argon2'
import { MailDataRequired } from '@sendgrid/mail'
import { validate } from 'class-validator'

import { FRONTEND_APP_URL } from '../../config'
import { User } from '../../entities'
import { EmailInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { sgMail } from '../../utilities'

export const sendForgotPasswordEmail = async (
  options: EmailInput,
  context: MyContext
): Promise<DefaultResponse> => {
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

  await sgMail.send(forgetPasswordMailData, false)

  // Capture user log
  await captureUserActivity(user, context, 'Requested Forgot Password Verification Email', true)

  return {}
}
