import { CookieOptions } from 'express'
import { COOKIE_SAMESITE, COOKIE_SECURE } from './app.config'

const cookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 4,
  expires: new Date(Date.now() + 1000 * 60 * 4),
  httpOnly: true,
  sameSite: COOKIE_SAMESITE,
  secure: COOKIE_SECURE
}

export default cookieOptions
