import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import paypal from '@paypal/checkout-server-sdk'

import { stripe } from '../utilities'
import { Payment, User, Service as ServiceEntity } from '../entities'
import { UserService } from './user.service'
import { PaymentUpdateBody } from '../interfaces/PaymentUpdateBody'
import { PaypalPaymentRecord } from '../json-types'
import { appConfig } from '../config'
import { ErrorCode } from '../types'

@Service()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UserService
  ) {}

  /**
   * Get paypal client
   * @returns {any}
   */
  getPaypalClient(environment: 'live' | 'sandbox' = 'sandbox'): any {
    const Environment =
      environment === 'live' ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment
    const paypalClientId =
      environment === 'live' ? appConfig.PAYPAL_LIVE_CLIENT_ID : appConfig.PAYPAL_SANDBOX_CLIENT_ID
    const paypalClientSecret =
      environment === 'live'
        ? appConfig.PAYPAL_LIVE_CLIENT_SECRET
        : appConfig.PAYPAL_SANDBOX_CLIENT_SECRET

    const paypalClient = new paypal.core.PayPalHttpClient(
      new Environment(paypalClientId, paypalClientSecret)
    )

    return paypalClient
  }

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
  async savePayment(updateBody: PaymentUpdateBody): Promise<Payment> {
    try {
      const payment = this.paymentRepository.create({
        amountPaid: updateBody.amountPaid,
        paymentCurrency: updateBody.paymentCurrency,
        paymentDetails: updateBody.paymentDetails,
        paymentProvider: updateBody.paymentProvider,
        paymentType: updateBody.paymentType,
        representedId: updateBody.representedId,
      })

      if (updateBody.user) payment.user = Promise.resolve(updateBody.user)
      if (updateBody.order) payment.order = Promise.resolve(updateBody.order)
      if (updateBody.plan) payment.plan = Promise.resolve(updateBody.plan)

      await payment.save()

      return payment
    } catch (e) {
      throw new ApolloError('Something went wrong', ErrorCode.DATABASE_ERROR)
    }
  }

  /**
   * Create paypal order
   * @param {ServiceEntity} service
   * @returns {Promise<string>}
   */
  async paypalCheckoutCreateOrder(service: ServiceEntity): Promise<string> {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: service.price,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: service.price,
              },
            },
          },
          items: [
            {
              name: service.title,
              unit_amount: {
                currency_code: 'USD',
                value: service.price,
              },
              quantity: 1,
              description: service.description,
            },
          ],
        },
      ],
    })

    try {
      const order = await this.getPaypalClient(appConfig.__prod__ ? 'live' : 'sandbox').execute(
        request
      )
      return order.result.id as string
    } catch (e) {
      throw new ApolloError('Something went wrong', ErrorCode.DATABASE_ERROR)
    }
  }

  /**
   * Check if a represented id payment is presetn
   * @param {string} representedId
   * @returns Promise<boolean>
   */
  async isPaymentDone(representedId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({
      where: {
        representedId,
      },
    })

    return !!payment
  }

  /**
   * Capture paypal order
   * @param {string} orderId
   * @returns {Promise<PaypalPaymentRecord>}
   */
  async paypalCheckoutCaptureOrder(orderId: string): Promise<PaypalPaymentRecord> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.prefer('return=representation')
    request.requestBody({})

    try {
      const response = await this.getPaypalClient(appConfig.__prod__ ? 'live' : 'sandbox').execute(
        request
      )

      const paymentInfo = response.result as PaypalPaymentRecord

      if (paymentInfo.status === 'COMPLETED' && !this.isPaymentDone(paymentInfo.id)) {
        return paymentInfo
      } else {
        throw new ApolloError('Something went wrong', ErrorCode.DATABASE_ERROR)
      }
    } catch (e) {
      throw new ApolloError('Something went wrong', ErrorCode.DATABASE_ERROR)
    }
  }
}