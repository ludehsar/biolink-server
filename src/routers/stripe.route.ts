import { Router, Response } from 'express'

import { savePayment, saveStripeCustomerId } from '../services'
import { appConfig } from '../config'
import { getAuthUser, stripe } from '../utilities'
import { PaymentMethod } from '../enums'

// TODO: change http://localhost:3000 to FRONTEND_APP_URL

const stripeRoutes = Router()

stripeRoutes.post('/create-checkout-session', async (req, res): Promise<Response | void> => {
  const user = await getAuthUser(req, res)

  if (!user) {
    res.status(401)
    return res.send({
      error: {
        message: 'User not authenticated',
      },
    })
  }

  if (!user.stripeCustomerId || user.stripeCustomerId.trim().length <= 0) {
    await saveStripeCustomerId(user)
  }

  const { priceId } = req.body
  const couponCode =
    (await user.registeredByCode) && !user.usedReferralsToPurchasePlan
      ? (await user.registeredByCode).code
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
})

stripeRoutes.post('/webhook', async (req, res): Promise<Response | void> => {
  let data
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
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      await savePayment(
        {
          stripeAmountDue: data.object.amount_due,
          stripeAmountPaid: data.object.amount_paid,
          stripeAmountRemaining: data.object.amount_remaining,
          stripeChargeId: data.object.charge,
          stripeCustomerAddress: data.object.customer_address,
          stripeCustomerEmail: data.object.customer_email,
          stripeCustomerId: data.object.customer,
          stripeCustomerName: data.object.customer_name,
          stripeCustomerPhone: data.object.customer_phone,
          stripeCustomerShipping: data.object.customer_shipping,
          stripeDiscount: data.object.discount,
          stripeInvoiceCreated: data.object.created,
          stripeInvoiceNumber: data.object.number,
          stripeInvoicePdfUrl: data.object.invoice_pdf,
          stripeInvoiceUrl: data.object.hosted_invoice_url,
          stripePaymentCurrency: data.object.currency,
          stripePeriodEnd: data.object.lines.data[0].period.end,
          stripePeriodStart: data.object.lines.data[0].period.start,
          stripePriceId: data.object.lines.data[0].price.id,
          stripeStatus: data.object.status,
          stripeSubscriptionId: data.object.subscription,
          paymentType: PaymentMethod.Stripe,
        },
        { req, res }
      )
      break
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break
    default:
    // Unhandled event type
  }

  res.sendStatus(200)
})

stripeRoutes.post('/customer-portal', async (req, res): Promise<Response | void> => {
  const user = await getAuthUser(req, res)

  if (!user) {
    res.status(401)
    return res.send({
      message: 'User not authenticated',
    })
  }

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = 'http://localhost:3000'

  const portalsession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  })

  res.send({
    url: portalsession.url,
  })
})

export default stripeRoutes
