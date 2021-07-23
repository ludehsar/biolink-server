import { PaymentSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { PaymentSystemSettings } from '../../json-types'

export const getPaymentSettings = async (
  adminUser: User,
  context: MyContext
): Promise<PaymentSettingsResponse> => {
  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  if (!adminRole || adminRole.roleName !== 'Administrator') {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  let payment = await Settings.findOne({ where: { key: 'payment' } })

  if (!payment) {
    payment = await Settings.create({
      key: 'payment',
    }).save()
  }

  const paymentSettings = payment.value as PaymentSystemSettings

  await captureUserActivity(adminUser, context, `Requested payment settings`, false)

  return { settings: paymentSettings }
}
