import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { stripe } from '../utilities'
import { Payment, User } from '../entities'
import { UserService } from './user.service'
import { PaymentUpdateBody } from '../interfaces/PaymentUpdateBody'
import { StripeInvoiceObject } from '../json-types'

@Service()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UserService
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
   * @param {PaymentUpdateBody} updateBody
   * @param {MyContext} context
   * @returns {Promise<Payment>}
   */
  async saveStripeSubscriptionPayment(updateBody: PaymentUpdateBody): Promise<Payment> {
    const payment = this.paymentRepository.create({
      amountPaid: updateBody.amountPaid,
      paymentCurrency: updateBody.paymentCurrency,
      paymentDetails: updateBody.paymentDetails,
      paymentProvider: updateBody.paymentProvider,
      paymentType: updateBody.paymentType,
    })

    if (updateBody.user) payment.user = Promise.resolve(updateBody.user)
    if (updateBody.order) payment.order = Promise.resolve(updateBody.order)
    if (updateBody.plan) payment.plan = Promise.resolve(updateBody.plan)

    await this.userService.updateUserById((updateBody.user as User).id, {
      stripeCustomerId: (payment.paymentDetails as StripeInvoiceObject).customer,
      usedReferralsToPurchasePlan: true,
    })

    await payment.save()

    return payment
  }
}
