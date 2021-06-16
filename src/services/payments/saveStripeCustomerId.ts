import { DefaultResponse } from '../../object-types'
import { User } from '../../entities'
import { ErrorCode } from '../../types'

export const saveStripeCustomerId = async (
  user: User,
  customerId: string
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

  user.stripeCustomerId = customerId

  await user.save()

  return {}
}
