import { AccessTokenResponse } from '../../object-types'
import { User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { generateNewToken } from '../../utilities'

export const getAccessToken = async (
  user: User,
  context: MyContext
): Promise<AccessTokenResponse> => {
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

  if (!context.req.cookies.access_token) {
    const { accessToken } = await generateNewToken(user, context.res)
    return {
      access_token: accessToken,
    }
  }

  return {
    access_token: context.req.cookies.access_token,
  }
}
