import randToken from 'rand-token'
import { MailDataRequired } from '@sendgrid/mail'
import { appConfig } from '../../config'
import { User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { sgMail } from '../../utilities'

export const sendVerificationEmail = async (
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
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

  let emailActivationCode = randToken.generate(132)
  let userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })

  while (userWithSameActivationCode) {
    emailActivationCode = randToken.generate(132)
    userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })
  }

  // user.emailActivationCode = emailActivationCode
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
    html: `Click <a href="${appConfig.FRONTEND_APP_URL}/auth/email_verification?token=${emailActivationCode}" target="_blank">here</a> to verify your email address.`,
  }

  await sgMail.send(emailActivationMailData, false)

  // Capture user log
  await captureUserActivity(user, context, 'Requested User Email Verification', true)

  return {}
}
