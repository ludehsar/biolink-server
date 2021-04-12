import { sign } from 'jsonwebtoken'
import * as argon2 from 'argon2'
import { generate } from 'rand-token'

import { refreshTokenSecret, accessTokenSecret } from '../config/app.config'
import { User } from '../models/entities/User'

export const createAuthTokens = async (
  user: User
): Promise<{ refreshToken: string; accessToken: string }> => {
  const newToken = generate(63)
  user.tokenCode = await argon2.hash(newToken)
  await user.save()
  const refreshToken = sign({ userId: user.id, token: newToken }, refreshTokenSecret, {
    expiresIn: '7d',
  })
  const accessToken = sign({ userId: user.id }, accessTokenSecret, { expiresIn: '1min' })

  return { refreshToken, accessToken }
}
