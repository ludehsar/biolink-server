import moment from 'moment'
import { Service } from 'typedi'
import { Request, Response } from 'express'
import Stripe from 'stripe'

import { Code, User } from '../entities'
import { PaymentService } from '../services/payment.service'
import { stripe } from '../utilities'
import { appConfig } from '../config'
import { PaymentCurrency, PaymentProvider, PaymentType } from '../enums'
import { StripeInvoiceObject } from '../json-types'
import { PlanService } from '../services/plan.service'
import { NotificationService } from '../services/notification.service'
import { UserService } from '../services/user.service'

@Service()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly planService: PlanService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}

  async createStripeCheckoutSession(req: Request, res: Response): Promise<Response | void> {
    const user = req.user as User

    if (!user.stripeCustomerId || user.stripeCustomerId.trim().length <= 0) {
      await this.paymentService.saveStripeCustomerId(user)
    }

    const { priceId } = req.body
    const couponCode =
      (await user.registeredByCode) && !user.usedReferralsToPurchasePlan
        ? ((await user.registeredByCode) as Code).code
        : undefined

    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
            currency: 'usd',
          },
        ],
        discounts: [
          {
            coupon: couponCode,
          },
        ],
        customer: user.stripeCustomerId,
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url:
          appConfig.FRONTEND_APP_URL + `/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: appConfig.FRONTEND_APP_URL + `/payment/canceled`,
      })

      res.send({
        sessionId: session.id,
      })
    } catch (e: any) {
      res.status(400)
      return res.send({
        error: {
          message: e.message,
        },
      })
    }
  }

  async getStripeWebhookResponse(req: Request, res: Response): Promise<Response | void> {
    let data: Stripe.Event.Data
    let eventType

    // Check if webhook signing is configured.
    const webhookSecret = appConfig.STRIPE_WEBHOOK_SECRET
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event
      const signature = req.headers['stripe-signature']

      try {
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody,
          signature as string | string[] | Buffer,
          webhookSecret
        )
      } catch (err) {
        console.log(`Webhook signature verification failed.`)
        return res.sendStatus(400)
      }
      // Extract the object from the event.
      data = event.data
      eventType = event.type
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data
      eventType = req.body.type
    }

    switch (eventType) {
      case 'invoice.paid': {
        // First, list and remove all the previous subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: (data.object as Stripe.Invoice).customer as string | undefined,
          limit: 100,
          status: 'active',
        })
        subscriptions.data.forEach(async (subscription) => {
          if (subscription.id !== (data.object as Stripe.Invoice).subscription) {
            await stripe.subscriptions.del(subscription.id)
          }
        })
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        const user = await this.userService.getUserByStripeCustomerId(
          (data.object as Stripe.Invoice).customer as string
        )

        const plan = await this.planService.getPlanByStripePriceId(
          (data.object as Stripe.Invoice).lines.data[0].price?.id || ''
        )

        const payment = await this.paymentService.saveStripeSubscriptionPayment({
          amountPaid: (data.object as Stripe.Invoice).amount_paid,
          paymentCurrency: (data.object as Stripe.Invoice).currency as PaymentCurrency,
          paymentDetails: Object.assign({} as StripeInvoiceObject, data.object),
          paymentProvider: PaymentProvider.Stripe,
          paymentType: PaymentType.Subscription,
          plan,
          user,
        })

        await this.planService.subscribePlanByUserId(
          (payment.paymentDetails as StripeInvoiceObject).lines?.data[0].price?.id,
          moment
            .unix((payment.paymentDetails as StripeInvoiceObject).lines?.data[0].period.end)
            .toDate(),
          user.id
        )

        await this.notificationService.createUserLogs(
          user,
          { req, res },
          `User paid ${payment.amountPaid}$ for subscription`,
          true
        )

        break
      }
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break
      default:
      // Unhandled event type
    }

    res.sendStatus(200)
  }
}
