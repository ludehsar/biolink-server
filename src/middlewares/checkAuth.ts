import { Response } from 'express'
import { MiddlewareFn, NextFn } from 'type-graphql'
import { verify } from 'jsonwebtoken'

import { accessTokenSecret, refreshTokenSecret } from '../config/app.config'
import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { MyContext } from '../MyContext'

const invalidateToken = (res: Response) => {
  res.cookie('refresh_token', '', refreshTokenCookieOptions)
  res.cookie('access_token', '', accessTokenCookieOptions)
}

const generateNewToken = (user: User, res: Response) => {
  const { refreshToken: newRefreshToken, accessToken: newAccessToken } = createAuthTokens(user)

  res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions)
  res.cookie('access_token', newAccessToken, accessTokenCookieOptions)
}

const checkAuth: MiddlewareFn<MyContext> = async ({ context }, next: NextFn) => {
  const refreshToken = context.req.cookies.refresh_token
  const accessToken = context.req.cookies.access_token

  // If no token, return
  if (!refreshToken && !accessToken) {
    invalidateToken(context.res)
    throw new Error('User not authenticated.')
  }

  // Verify access token
  try {
    const data = verify(accessToken, accessTokenSecret) as any

    // For token validation
    const user = await User.findOne(data.userId)

    // If token tempared
    if (!user) {
      invalidateToken(context.res)
      throw new Error('User not authenticated.')
    } else {
      return next()
    }
  } catch {}

  if (!refreshToken) {
    invalidateToken(context.res)
    throw new Error('User not authenticated.')
  }

  // Verify refresh token
  try {
    const data = verify(refreshToken, refreshTokenSecret) as any
    const user = await User.findOne(data.userId)

    if (!user) {
      invalidateToken(context.res)
      throw new Error('User not authenticated.')
    }

    await User.save(user)

    generateNewToken(user, context.res)
  } catch {}

  next()
}

export default checkAuth
