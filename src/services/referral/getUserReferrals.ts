import { User } from '../../entities'
import { ReferralResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getUserReferrals = async (user: User): Promise<ReferralResponse> => {
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

  return {
    referrals,
  }
}
