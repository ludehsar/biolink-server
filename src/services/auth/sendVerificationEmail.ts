import { MailDataRequired } from '@sendgrid/mail'
import { FRONTEND_APP_URL } from 'config'
import { User } from 'entities'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'
import { sgMail } from 'utilities'
import randToken from 'rand-token'

export const sendVerificationEmail = async (
  user: User,
  context: MyContext
): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []
  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })
  }

  let emailActivationCode = randToken.generate(132)
  let userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })

  while (userWithSameActivationCode) {
    emailActivationCode = randToken.generate(132)
    userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })
  }

  user.emailActivationCode = emailActivationCode
  await user.save()

  const emailActivationMailData: MailDataRequired = {
    to: {
      email: user.email,
    },
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Verify Your Email Address`,
    html: `Click <a href="${FRONTEND_APP_URL}/auth/email_verification?token=${emailActivationCode}" target="_blank">here</a> to verify your email address.`,
  }

  await sgMail.send(emailActivationMailData, false, (err) => {
    errors.push({
      errorCode: ErrorCode.DATABASE_ERROR,
      message: err.message,
    })
  })

  // Capture user log
  await captureUserActivity(user, context, 'Requested User Email Verification')

  return errors
}
