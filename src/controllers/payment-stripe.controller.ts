import Stripe from 'stripe'
import { Request, Response } from 'express'
import moment from 'moment'

import { appConfig } from '../config'
import { User, Code, Plan, Payment } from '../entities'
import { PaymentCurrency, PaymentProvider, PaymentType, PlanType } from '../enums'
import { StripeInvoiceObject } from '../json-types'
import { stripe } from '../utilities'

const createStripeCheckoutSession = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const user = req.user as User

  if (!user.stripeCustomerId || user.stripeCustomerId.trim().length <= 0) {
    const customer = await stripe.customers.create({
      email: user.email,
    })

    user.stripeCustomerId = customer.id
    await user.save()
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
      success_url: appConfig.FRONTEND_APP_URL + `/payment/success?session_id={CHECKOUT_SESSION_ID}`,
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

const getStripeWebhookResponse = async (req: Request, res: Response): Promise<Response | void> => {
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
      const user = await User.findOne({
        where: {
          stripeCustomerId: (data.object as Stripe.Invoice).customer,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const plan = await Plan.findOne({
        where: [
          { monthlyPriceStripeId: (data.object as Stripe.Invoice).lines.data[0].price?.id },
          { annualPriceStripeId: (data.object as Stripe.Invoice).lines.data[0].price?.id },
        ],
      })

      if (!plan) {
        throw new Error('Plan not found')
      }

      const payment = Payment.create({
        representedId: (data.object as Stripe.Invoice).id,
        amountPaid: (data.object as Stripe.Invoice).amount_paid,
        paymentCurrency: (data.object as Stripe.Invoice).currency as PaymentCurrency,
        paymentDetails: Object.assign({} as StripeInvoiceObject, data.object),
        paymentProvider: PaymentProvider.Stripe,
        paymentType: PaymentType.Subscription,
      })

      payment.plan = Promise.resolve(plan)
      payment.user = Promise.resolve(user)

      await payment.save()

      user.usedReferralsToPurchasePlan = true
      user.plan = Promise.resolve(plan)
      user.planExpirationDate = moment
        .unix((payment.paymentDetails as StripeInvoiceObject).lines?.data[0].period.end)
        .toDate()
      user.planType =
        plan.monthlyPriceStripeId ===
        (payment.paymentDetails as StripeInvoiceObject).lines?.data[0].price?.id
          ? PlanType.Monthly
          : PlanType.Annual
      await user.save()

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

export default { createStripeCheckoutSession, getStripeWebhookResponse }
