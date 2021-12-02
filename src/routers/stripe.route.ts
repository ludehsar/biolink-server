import { Router, Response } from 'express'

import { appConfig } from '../config'
import { getAuthUser, stripe } from '../utilities'
import { authRest } from '../middlewares'
import { StripePaymentController } from '../controllers'

const stripeRoutes = Router()

stripeRoutes.post(
  '/create-checkout-session',
  authRest,
  StripePaymentController.createStripeCheckoutSession
)

stripeRoutes.post('/webhook', StripePaymentController.getStripeWebhookResponse)

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
  const returnUrl = appConfig.FRONTEND_APP_URL

  const portalsession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  })

  res.send({
    url: portalsession.url,
  })
})

export default stripeRoutes
