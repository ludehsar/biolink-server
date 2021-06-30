import { captureUserActivity } from '../../services'
import { User } from '../../entities'
import { ReferralResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getUserReferrals = async (
  user: User,
  context: MyContext
): Promise<ReferralResponse> => {
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

  const referrals = await user.referrals

  await captureUserActivity(user, context, `Requested user referrals`, false)

  return {
    referrals,
  }
}
