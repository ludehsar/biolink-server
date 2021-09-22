import { sign } from 'jsonwebtoken'
import { appConfig } from '../config'
import { User } from '../entities'

export const createAuthTokens = async (
  user: User
): Promise<{ refreshToken: string; accessToken: string }> => {
  const refreshToken = sign({ userId: user.id }, appConfig.refreshTokenSecret, {
    expiresIn: '7d',
  })

  // user.tokenCode = refreshToken
  await user.save()

  const accessToken = sign({ userId: user.id }, appConfig.accessTokenSecret, {
    expiresIn: '15min',
  })

  return { refreshToken, accessToken }
}
