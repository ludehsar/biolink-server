import { Response } from 'express'
import { verify } from 'jsonwebtoken'
import { createParamDecorator } from 'type-graphql'

import { User } from '../models/entities/User'
import { MyContext } from '../MyContext'
import { createAuthTokens } from '../utils/createAuthTokens'
import { refreshTokenSecret, accessTokenSecret } from '../config/app.config'
import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../config/cookie.config'
import { AdminRole } from '../models/entities/AdminRole'

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

export default function CurrentAdmin(): ParameterDecorator {
  return createParamDecorator<MyContext>(async ({ context }): Promise<User | null> => {
    context.userId = null

    const refreshToken = context.req.cookies.refresh_token
    const accessToken = context.req.cookies.access_token

    if (accessToken) {
      try {
        const data = verify(accessToken, accessTokenSecret) as DataProps

        const user = await User.findOne({ where: { id: data.userId } })

        if (!user || user.adminRoleId === null) {
          invalidateToken(context.res)
          return null
        }

        const adminRole = await AdminRole.findOne(user.adminRoleId)

        if (!adminRole) {
          invalidateToken(context.res)
          return null
        }

        context.userId = user.id
        return user
      } catch (err) {
        invalidateToken(context.res)
        return null
      }
    } else if (refreshToken) {
      try {
        const data = verify(refreshToken, refreshTokenSecret) as DataProps

        const user = await User.findOne({ where: { id: data.userId, tokenCode: refreshToken } })

        if (!user || user.adminRoleId === null) {
          invalidateToken(context.res)
          return null
        }

        const adminRole = await AdminRole.findOne(user.adminRoleId)

        if (!adminRole) {
          invalidateToken(context.res)
          return null
        }

        await generateNewToken(user, context.res)
        context.userId = user.id
        return user
      } catch (err) {
        invalidateToken(context.res)
        return null
      }
    }

    invalidateToken(context.res)
    return null
  })
}
