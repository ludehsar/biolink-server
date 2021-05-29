import { refreshTokenCookieOptions, accessTokenCookieOptions } from 'config'
import { User } from 'entities'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const logoutUser = async (context: MyContext, user: User): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []
  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'Invalid request',
    })

    return errors
  }

  user.tokenCode = ''
  await user.save()

  context.res.cookie('refresh_token', '', refreshTokenCookieOptions)
  context.res.cookie('access_token', '', accessTokenCookieOptions)

  // Capture user log
  await captureUserActivity(user, context, 'User logs out')

  return errors
}
