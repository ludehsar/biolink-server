import randToken from 'rand-token'
import moment from 'moment'
import { User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const verifyEmailActivationToken = async (
  emailActivationCode: string,
  context: MyContext
): Promise<DefaultResponse> => {
  const user = await User.findOne({ where: { emailActivationCode } })

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid token',
        },
      ],
    }
  }

  let newEmailActivationCode = randToken.generate(132)
  let userWithSameActivationCode = await User.findOne({ where: { newEmailActivationCode } })

  while (userWithSameActivationCode) {
    newEmailActivationCode = randToken.generate(132)
    userWithSameActivationCode = await User.findOne({ where: { newEmailActivationCode } })
  }

  user.emailVerifiedAt = moment().toDate()
  user.emailActivationCode = newEmailActivationCode
  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'Email has been verified', true)

  return {}
}
