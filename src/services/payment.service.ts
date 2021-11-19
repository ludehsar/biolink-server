import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'
import moment from 'moment'

import { stripe } from '../utilities'
import { Payment, User } from '../entities'
import { UserService } from './user.service'
import { NewPaymentInput } from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { NotificationService } from './notification.service'
import { PlanService } from './plan.service'

@Service()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly planService: PlanService
  ) {}

  /**
   * Save stripe customer id
   * @param {User} user
   * @returns {Promise<User>}
   */
  async saveStripeCustomerId(user: User): Promise<User> {
    const customer = await stripe.customers.create({
      email: user.email,
    })

    return await this.userService.updateUserById(user.id, {
      stripeCustomerId: customer.id,
    })
  }

  /**
   * Save stripe payment
   * @param {NewPaymentInput} options
   * @param {MyContext} context
   * @returns {Promise<Payment>}
   */
  async saveStripePayment(options: NewPaymentInput, context: MyContext): Promise<Payment> {
    let user = await User.findOne({ where: { stripeCustomerId: options.stripeCustomerId } })

    if (!user) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    const payment = this.paymentRepository.create({
      paymentType: options.paymentType,
      stripeAmountDue: options.stripeAmountDue,
      stripeAmountPaid: options.stripeAmountPaid,
      stripeAmountRemaining: options.stripeAmountRemaining,
      stripeChargeId: options.stripeChargeId,
      stripeCustomerAddress: options.stripeCustomerAddress,
      stripeCustomerEmail: options.stripeCustomerEmail,
      stripeCustomerId: options.stripeCustomerId,
      stripeCustomerName: options.stripeCustomerName,
      stripeCustomerPhone: options.stripeCustomerPhone,
      stripeCustomerShipping: options.stripeCustomerShipping,
      stripeDiscount: options.stripeDiscount,
      stripeInvoiceCreated: options.stripeInvoiceCreated,
      stripeInvoiceNumber: options.stripeInvoiceNumber,
      stripeInvoicePdfUrl: options.stripeInvoicePdfUrl,
      stripeInvoiceUrl: options.stripeInvoiceUrl,
      stripePaymentCurrency: options.stripePaymentCurrency,
      stripePeriodEnd: moment.unix(options.stripePeriodEnd).toDate(),
      stripePeriodStart: moment.unix(options.stripePeriodStart).toDate(),
      stripePriceId: options.stripePriceId,
      stripeStatus: options.stripeStatus,
      stripeSubscriptionId: options.stripeSubscriptionId,
    })

    payment.user = Promise.resolve(user)

    user = await this.userService.updateUserById(user.id, {
      stripeCustomerId: payment.stripeCustomerId,
      usedReferralsToPurchasePlan: true,
    })

    await payment.save()
    await this.planService.subscribePlanByUserId(
      payment.stripePriceId,
      payment.stripePeriodEnd,
      user.id
    )

    await this.notificationService.createUserLogs(
      user,
      context,
      `User paid ${payment.stripeAmountPaid}$ for subscription`,
      true
    )

    return payment
  }
}
