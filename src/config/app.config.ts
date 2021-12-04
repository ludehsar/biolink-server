const __prod__: boolean = process.env.NODE_ENV === 'production' || false
const appDebug: boolean = process.env.APP_DEBUG === 'true' || !__prod__ || true
const appKey: string = process.env.APP_KEY as string
const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET as string
const emailVerificationTokenSecret: string = process.env.EMAIL_VERIFICATION_TOKEN_SECRET as string
const forgotPasswordTokenSecret: string = process.env.FORGOT_PASSWORD_TOKEN_SECRET as string
const accessTokenExpirationDays = 120
const refreshTokenExpirationDays = 7
const emailVerificationTokenExpirationDays = 2
const forgotPasswordTokenExpirationMinutes = 45
const port = process.env.PORT || 4000
const COOKIE_SAMESITE =
  <boolean | 'lax' | 'strict' | 'none' | undefined>process.env.APP_COOKIE_SAMESITE || 'lax'
const COOKIE_SECURE: boolean = process.env.APP_COOKIE_SECURE === 'true'
const COOKIE_NAME = 'qid'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL || 'http://localhost:3000'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'
const ADMIN_APP_URL = process.env.ADMIN_APP_URL || 'http://localhost:3000'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ''
const POSITIONTRACK_API_KEY = process.env.POSITIONTRACK_API_KEY || ''
const PAYPAL_SANDBOX_CLIENT_ID = process.env.PAYPAL_SANDBOX_CLIENT_ID || ''
const PAYPAL_SANDBOX_CLIENT_SECRET = process.env.PAYPAL_SANDBOX_CLIENT_SECRET || ''
const PAYPAL_LIVE_CLIENT_ID = process.env.PAYPAL_LIVE_CLIENT_ID || ''
const PAYPAL_LIVE_CLIENT_SECRET = process.env.PAYPAL_LIVE_CLIENT_SECRET || ''
const FROM_EMAIL = 'info@stash.ee'
const FROM_EMAIL_NAME = 'Stashee Support'

export default {
  ADMIN_APP_URL,
  BACKEND_URL,
  COOKIE_NAME,
  COOKIE_SAMESITE,
  COOKIE_SECURE,
  FRONTEND_APP_URL,
  GOOGLE_API_KEY,
  POSITIONTRACK_API_KEY,
  SENDGRID_API_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  __prod__,
  accessTokenSecret,
  emailVerificationTokenSecret,
  forgotPasswordTokenSecret,
  appDebug,
  appKey,
  port,
  refreshTokenSecret,
  accessTokenExpirationDays,
  refreshTokenExpirationDays,
  emailVerificationTokenExpirationDays,
  forgotPasswordTokenExpirationMinutes,
  FROM_EMAIL,
  FROM_EMAIL_NAME,
  PAYPAL_LIVE_CLIENT_ID,
  PAYPAL_LIVE_CLIENT_SECRET,
  PAYPAL_SANDBOX_CLIENT_ID,
  PAYPAL_SANDBOX_CLIENT_SECRET,
}
