import { Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { accessTokenSecret, refreshTokenSecret } from '../config/app.config'
import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'

const authCheck = async (req: any, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refresh_token
  const accessToken = req.cookies.access_token
  if (!refreshToken && !accessToken) {
    return next()
  }

  try {
    const data = verify(accessToken, accessTokenSecret) as any

    // For token validation
    const user = await User.findOne(data.userId)

    if (user) req.userId = user.id
    return next()
  } catch {}

  if (!refreshToken) {
    return next()
  }

  try {
    const data = verify(refreshToken, refreshTokenSecret) as any
    const user = await User.findOne(data.userId)

    if (!user || user.totalLogin !== data.count) {
      return next()
    }

    user.totalLogin++

    await User.save(user)
    req.userId = data.userId

    const { refreshToken: newRefreshToken, accessToken: newAccessToken } = createAuthTokens(user)

    res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions)
    res.cookie('access_token', newAccessToken, accessTokenCookieOptions)
  } catch {}

  next()
}

export default authCheck
