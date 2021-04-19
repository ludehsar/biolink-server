import { Response } from 'express'
import { MiddlewareFn, NextFn } from 'type-graphql'
import { verify } from 'jsonwebtoken'
import * as argon2 from 'argon2'

import { accessTokenSecret, refreshTokenSecret } from '../config/app.config'
import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { MyContext } from '../MyContext'

const invalidateToken = (res: Response): void => {
  res.cookie('refresh_token', '', refreshTokenCookieOptions)
  res.cookie('access_token', '', accessTokenCookieOptions)
}

const generateNewToken = async (user: User, res: Response): Promise<void> => {
  const { refreshToken: newRefreshToken, accessToken: newAccessToken } = await createAuthTokens(
    user
  )

  res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions)
  res.cookie('access_token', newAccessToken, accessTokenCookieOptions)
}

const checkAuth: MiddlewareFn<MyContext> = async ({ context }, next: NextFn) => {
  // Removing userId from request
  ;(context.req as any).userId = null

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
      ;(context.req as any).userId = user.id
      return next()
    }
  } catch (err) {
    // Pass for checking if refresh token is available
  }

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

    const tokenVerified = await argon2.verify(user.tokenCode, data.token)

    if (!tokenVerified) {
      invalidateToken(context.res)
      throw new Error('User not authenticated.')
    }

    generateNewToken(user, context.res)
    ;(context.req as any).userId = user.id
  } catch {
    throw new Error('User not authenticated')
  }

  next()
}

export default checkAuth
