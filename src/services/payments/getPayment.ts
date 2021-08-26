import { PaymentResponse } from '../../object-types'
import { Payment, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getPayment = async (
  paymentId: number,
  user: User,
  context: MyContext
): Promise<PaymentResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const payment = await Payment.findOne(paymentId)

  if (!payment) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PAYMENT_NOT_FOUND,
          message: 'Invalid payment id',
        },
      ],
    }
  }

  const adminRole = await user.adminRole

  const adminRoleSettings = adminRole?.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'payment'
  })

  if (
    payment.userId !== user.id &&
    (!adminRole || !userSettings || !userSettings.canShow) &&
    (!adminRole || adminRole.roleName !== 'Administrator')
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  await captureUserActivity(user, context, `Requested payment ${payment.id}`, false)

  return { payment }
}
