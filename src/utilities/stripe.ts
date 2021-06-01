import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '../config'

export const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
})
