import { Router, Response } from 'express'
import { Container } from 'typeorm-typedi-extensions'

import { appConfig } from '../config'
import { getAuthUser, stripe } from '../utilities'
import { authRest } from '../middlewares'
import { PaymentController } from '../controllers'
import { createConnection } from 'typeorm'

const stripeRoutes = Router()

createConnection().then(() => {
  const paymentController = Container.get(PaymentController)

  stripeRoutes.post(
    '/create-checkout-session',
    authRest,
    paymentController.createStripeCheckoutSession
  )

  stripeRoutes.post('/webhook', paymentController.getStripeWebhookResponse)

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
})

export default stripeRoutes
