import { CookieOptions } from 'express'

import { appConfig } from '../config'

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * appConfig.accessTokenExpirationMinutes,
  expires: new Date(Date.now() + 1000 * 60 * 15),
  httpOnly: true,
  sameSite: appConfig.COOKIE_SAMESITE,
  secure: appConfig.COOKIE_SECURE,
}

const refreshTokenCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * appConfig.refreshTokenExpirationDays,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  httpOnly: true,
  sameSite: appConfig.COOKIE_SAMESITE,
  secure: appConfig.COOKIE_SECURE,
}

export default {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
}
