import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { accessTokenSecret, refreshTokenSecret } from '../config/app.config'
import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'

const invalidateToken = (res: Response) => {
  res.cookie('refresh_token', '', refreshTokenCookieOptions)
  res.cookie('access_token', '', accessTokenCookieOptions)
}

const generateNewToken = (user: User, res: Response) => {
  const { refreshToken: newRefreshToken, accessToken: newAccessToken } = createAuthTokens(user)

  res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions)
  res.cookie('access_token', newAccessToken, accessTokenCookieOptions)
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refresh_token
  const accessToken = req.cookies.access_token

  // If no token, return
  if (!refreshToken && !accessToken) {
    invalidateToken(res)
    return next()
  }

  // Verify access token
  try {
    const data = verify(accessToken, accessTokenSecret) as any

    // For token validation
    const user = await User.findOne(data.userId)

    // If token tempared
    if (!user) {
      invalidateToken(res)
    }

    return next()
  } catch {}

  if (!refreshToken) {
    invalidateToken(res)
    return next()
  }

  // Verify refresh token
  try {
    const data = verify(refreshToken, refreshTokenSecret) as any
    const user = await User.findOne(data.userId)

    if (!user) {
      invalidateToken(res)
      return next()
    }

    await User.save(user)

    generateNewToken(user, res)
  } catch {}

  next()
}

export default checkAuth
