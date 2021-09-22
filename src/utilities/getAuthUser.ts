import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { User } from '../entities'
import { appConfig, cookieConfig } from '../config'
import { createAuthTokens } from '../utilities'

export interface DataProps {
  userId: string
  token: string
  iat: number
  exp: number
}

export const invalidateToken = (res: Response): void => {
  res.cookie('refresh_token', '', cookieConfig.refreshTokenCookieOptions)
}

export const generateNewToken = async (
  user: User,
  res: Response
): Promise<{ accessToken: string; refreshToken: string }> => {
  const { refreshToken, accessToken } = await createAuthTokens(user)

  res.cookie('refresh_token', refreshToken, cookieConfig.refreshTokenCookieOptions)

  return {
    accessToken,
    refreshToken,
  }
}

export const getAuthUser = async (req: Request, res: Response): Promise<User | null> => {
  const refreshToken = req.cookies.refresh_token
  const accessToken =
    req.cookies.access_token ||
    req.body.access_token ||
    req.query.access_token ||
    req.headers['x-access-token']

  if (accessToken) {
    try {
      const data = verify(accessToken, appConfig.accessTokenSecret) as DataProps

      const user = await User.findOne({ where: { id: data.userId } })

      if (!user) {
        invalidateToken(res)
        return null
      }

      return user
    } catch (err) {
      invalidateToken(res)
      return null
    }
  } else if (refreshToken) {
    try {
      const data = verify(refreshToken, appConfig.refreshTokenSecret) as DataProps

      const user = await User.findOne({ where: { id: data.userId, tokenCode: refreshToken } })

      if (!user) {
        invalidateToken(res)
        return null
      }

      await generateNewToken(user, res)
      return user
    } catch (err) {
      invalidateToken(res)
      return null
    }
  }

  invalidateToken(res)
  return null
}
