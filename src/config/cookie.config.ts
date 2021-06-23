import { CookieOptions } from 'express'

import { COOKIE_SAMESITE, COOKIE_SECURE } from '../config'

export const accessTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 15,
  expires: new Date(Date.now() + 1000 * 60 * 15),
  httpOnly: true,
  sameSite: COOKIE_SAMESITE,
  secure: COOKIE_SECURE,
}

export const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  httpOnly: true,
  sameSite: COOKIE_SAMESITE,
  secure: COOKIE_SECURE,
}
