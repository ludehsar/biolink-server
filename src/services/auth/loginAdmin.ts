import { cookieConfig } from '../../config'
import { User } from '../../entities'
import { LoginInput } from '../../input-types'
import { UserResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext } from '../../types'
import { createAuthTokens } from '../../utilities'
import { loginAdminValidated } from '../../validations'

export const loginAdmin = async (
  options: LoginInput,
  context: MyContext
): Promise<UserResponse> => {
  const errors = await loginAdminValidated(options)

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  const user = await User.findOneOrFail({ where: { email: options.email } })

  // Implement jwt
  const { refreshToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, cookieConfig.refreshTokenCookieOptions)

  user.totalLogin++

  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'User logs in', true)

  return { user }
}
