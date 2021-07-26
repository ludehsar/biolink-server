import { validate } from 'class-validator'
import { PaymentSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { PaymentSettingsInput } from '../../input-types'
import { PaymentSystemSettings } from '../../json-types'
import { PaymentType } from '../../enums'

export const editPaymentSettings = async (
  options: PaymentSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<PaymentSettingsResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

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

  const paymentSettings = (payment.value || {}) as PaymentSystemSettings

  paymentSettings.brandName = options.brandName || ''
  paymentSettings.currency = options.currency || ''
  paymentSettings.enableDiscountOrRedeemableCode = options.enableDiscountOrRedeemableCode || false
  paymentSettings.enablePaymentSystem = options.enablePaymentSystem || false
  paymentSettings.enablePaypal = options.enablePaypal || false
  paymentSettings.enableStripe = options.enableStripe || false
  paymentSettings.enableTaxesAndBilling = options.enableTaxesAndBilling || false
  paymentSettings.enabledPaymentType = options.enabledPaymentType || PaymentType.Both

  payment.value = paymentSettings
  await payment.save()

  await captureUserActivity(adminUser, context, `Changed payment settings`, true)

  return { settings: paymentSettings }
}
