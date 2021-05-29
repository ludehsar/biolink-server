import { Router, Response } from 'express'
import { stripe } from 'utilities'

const stripeRoutes = Router()

stripeRoutes.post('/create-checkout-session', async (req, res): Promise<Response | void> => {
  const { priceId } = req.body

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${process.env.FRONTEND_APP_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_APP_URL}/canceled.html`,
    })

    res.send({
      sessionId: session.id,
    })
  } catch (e) {
    res.status(400)
    return res.send({
      error: {
        message: e.message,
      },
    })
  }
})

export default stripeRoutes
