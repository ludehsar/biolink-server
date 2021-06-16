import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { User } from '../entities'
import {
  accessTokenCookieOptions,
  accessTokenSecret,
  refreshTokenCookieOptions,
  refreshTokenSecret,
} from '../config'
import { createAuthTokens } from '../utilities'

interface DataProps {
  userId: string
  token: string
  iat: number
  exp: number
}

const invalidateToken = (res: Response): void => {
  res.cookie('refresh_token', '', refreshTokenCookieOptions)
  res.cookie('access_token', '', accessTokenCookieOptions)
}

const generateNewToken = async (user: User, res: Response): Promise<void> => {
  const { refreshToken, accessToken } = await createAuthTokens(user)

  res.cookie('access_token', accessToken, accessTokenCookieOptions)
  res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
}

export const getAuthUser = async (req: Request, res: Response): Promise<User | null> => {
  const refreshToken = req.cookies.refresh_token
  const accessToken = req.cookies.access_token

  if (accessToken) {
    try {
      const data = verify(accessToken, accessTokenSecret) as DataProps

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
      const data = verify(refreshToken, refreshTokenSecret) as DataProps

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
