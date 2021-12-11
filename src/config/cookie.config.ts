import { CookieOptions } from 'express'

import { appConfig } from '../config'

const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * appConfig.refreshTokenExpirationDays,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * appConfig.refreshTokenExpirationDays - 2000),
  httpOnly: true,
  sameSite: appConfig.COOKIE_SAMESITE,
  secure: appConfig.COOKIE_SECURE,
}

export default {
  refreshTokenCookieOptions,
}
