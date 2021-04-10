import { sign } from 'jsonwebtoken'

import { refreshTokenSecret, accessTokenSecret } from '../config/app.config'
import { User } from '../models/entities/User'

export const createAuthTokens = (user: User) => {
  const refreshToken = sign({ userId: user.id, count: user.totalLogin }, refreshTokenSecret, { expiresIn: '7d' })
  const accessToken = sign({ userId: user.id }, accessTokenSecret, { expiresIn: '4min' })

  return { refreshToken, accessToken }
}
