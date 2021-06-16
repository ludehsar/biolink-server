import { DefaultResponse } from '../../object-types'
import { User } from '../../entities'
import { ErrorCode } from '../../types'
import { stripe } from '../../utilities'

export const saveStripeCustomerId = async (user: User): Promise<DefaultResponse> => {
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

  const customer = await stripe.customers.create({
    email: user.email,
  })

  user.stripeCustomerId = customer.id
  await user.save()

  return {}
}
