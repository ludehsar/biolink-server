import { cookieConfig } from '../../config'
import { User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const logoutUser = async (context: MyContext, user: User): Promise<DefaultResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Invalid request',
        },
      ],
    }
  }

  // user.tokenCode = ''
  await user.save()

  context.res.cookie('refresh_token', '', cookieConfig.refreshTokenCookieOptions)
  context.res.cookie('access_token', '', cookieConfig.accessTokenCookieOptions)

  // Capture user log
  await captureUserActivity(user, context, 'User logs out', true)

  return {}
}
