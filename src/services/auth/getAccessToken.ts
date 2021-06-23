import { AccessTokenResponse } from '../../object-types'
import { User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'

export const getAccessToken = (user: User, context: MyContext): AccessTokenResponse => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  return {
    access_token: context.req.cookies.access_token,
  }
}
