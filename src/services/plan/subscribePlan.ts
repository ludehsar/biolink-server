import { Plan, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const subscribePlan = async (
  stripePriceId: string,
  expirationDate: Date,
  user: User
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

  const plan = await Plan.findOne({
    where: [{ monthlyPriceStripeId: stripePriceId }, { annualPriceStripeId: stripePriceId }],
  })

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not found',
        },
      ],
    }
  }

  user.plan = Promise.resolve(plan)
  user.planExpirationDate = expirationDate

  await user.save()

  return {}
}
