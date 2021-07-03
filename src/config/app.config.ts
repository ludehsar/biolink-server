export const __prod__: boolean = process.env.NODE_ENV === 'production' || false
export const appDebug: boolean = process.env.APP_DEBUG === 'true' || !__prod__ || true
export const appKey: string = process.env.APP_KEY as string
export const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET as string
export const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET as string
export const port = process.env.PORT || 4000
export const COOKIE_SAMESITE =
  <boolean | 'lax' | 'strict' | 'none' | undefined>process.env.APP_COOKIE_SAMESITE || 'lax'
export const COOKIE_SECURE: boolean = process.env.APP_COOKIE_SECURE === 'true'
export const COOKIE_NAME = 'qid'
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
export const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL || 'http://localhost:3000'
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'
export const ADMIN_APP_URL = process.env.ADMIN_APP_URL || 'http://localhost:3000'
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ''
