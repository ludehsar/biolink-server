import { DefaultResponse } from '../../object-types'

export const savePayment = async (): // options: NewPaymentInput
// context: MyContext
Promise<DefaultResponse> => {
  // const user = await User.findOne({ where: { stripeCustomerId: options.stripeCustomerId } })

  // if (!user) {
  //   return {
  //     errors: [
  //       {
  //         errorCode: ErrorCode.USER_NOT_FOUND,
  //         message: 'User not found',
  //       },
  //     ],
  //   }
  // }

  // const payment = Payment.create({
  //   paymentProvider: options.paymentType,
  //   stripeAmountDue: options.stripeAmountDue,
  //   stripeAmountPaid: options.stripeAmountPaid,
  //   stripeAmountRemaining: options.stripeAmountRemaining,
  //   stripeChargeId: options.stripeChargeId,
  //   stripeCustomerAddress: options.stripeCustomerAddress,
  //   stripeCustomerEmail: options.stripeCustomerEmail,
  //   stripeCustomerId: options.stripeCustomerId,
  //   stripeCustomerName: options.stripeCustomerName,
  //   stripeCustomerPhone: options.stripeCustomerPhone,
  //   stripeCustomerShipping: options.stripeCustomerShipping,
  //   stripeDiscount: options.stripeDiscount,
  //   stripeInvoiceCreated: options.stripeInvoiceCreated,
  //   stripeInvoiceNumber: options.stripeInvoiceNumber,
  //   stripeInvoicePdfUrl: options.stripeInvoicePdfUrl,
  //   stripeInvoiceUrl: options.stripeInvoiceUrl,
  //   stripePaymentCurrency: options.stripePaymentCurrency,
  //   stripePeriodEnd: moment.unix(options.stripePeriodEnd).toDate(),
  //   stripePeriodStart: moment.unix(options.stripePeriodStart).toDate(),
  //   stripePriceId: options.stripePriceId,
  //   stripeStatus: options.stripeStatus,
  //   stripeSubscriptionId: options.stripeSubscriptionId,
  // })

  // payment.user = Promise.resolve(user)

  // user.stripeCustomerId = payment.stripeCustomerId
  // user.usedReferralsToPurchasePlan = true
  // await user.save()

  // await payment.save()
  // await subscribePlan(payment.stripePriceId, payment.stripePeriodEnd, user, context)

  // await captureUserActivity(
  //   user,
  //   context,
  //   `User paid ${payment.stripeAmountPaid}$ for subscription`,
  //   true
  // )
  return {}
}
