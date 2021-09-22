import Stripe from 'stripe'
import { appConfig } from '../config'

export const stripe = new Stripe(appConfig.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
})
