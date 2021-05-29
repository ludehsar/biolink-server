import { refreshTokenSecret, accessTokenSecret } from 'config'
import { User } from 'entities'
import { sign } from 'jsonwebtoken'

export const createAuthTokens = async (
  user: User
): Promise<{ refreshToken: string; accessToken: string }> => {
  const refreshToken = sign({ userId: user.id }, refreshTokenSecret, {
    expiresIn: '7d',
  })

  user.tokenCode = refreshToken
  await user.save()

  const accessToken = sign({ userId: user.id }, accessTokenSecret, {
    expiresIn: '15min',
  })

  return { refreshToken, accessToken }
}
