import { refreshTokenCookieOptions, accessTokenCookieOptions } from '../../config'
import { Code, User, Plan } from '../../entities'
import { RegisterInput } from '../../input-types'
import { UserResponse } from '../../object-types'
import {
  createBiolink,
  createReferralCode,
  captureUserActivity,
  sendVerificationEmail,
} from '../../services'
import { MyContext } from '../../types'
import { createAuthTokens } from '../../utilities'
import { registerUserValidated } from '../../validations'
import argon2 from 'argon2'
import randToken from 'rand-token'

export const registerUser = async (
  options: RegisterInput,
  context: MyContext,
  referralToken?: string
): Promise<UserResponse> => {
  const errors = await registerUserValidated(options, referralToken)

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  let code = null
  if (referralToken) {
    code = await Code.findOne({
      where: {
        code: referralToken,
      },
    })
  }

  // Creating user
  const hashedPassword = await argon2.hash(options.password as string)

  // Saving user password and resetting forgotPasswordCode
  const encryptedForgotPasswordCode = await argon2.hash(randToken.generate(160))

  const user = User.create({
    email: options.email,
    encryptedPassword: hashedPassword,
    forgotPasswordCode: encryptedForgotPasswordCode,
    totalLogin: 1,
  })

  if (code) {
    user.registeredByCode = Promise.resolve(code)
  }

  const freePlan = await Plan.findOneOrFail({ where: { name: 'Free' } })

  user.plan = Promise.resolve(freePlan)

  await user.save()

  await createBiolink({ username: options.username }, context, user)

  await createReferralCode(user)

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  // Capture user log
  await captureUserActivity(user, context, 'User Registered')

  // send verification email
  await sendVerificationEmail(user, context)

  // Send email to admins, if new user email is checked

  await user.reload()
  return { user }
}
