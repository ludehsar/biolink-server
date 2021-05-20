import { validate } from 'class-validator'
import * as argon2 from 'argon2'
import randToken from 'rand-token'
import moment from 'moment'
import { MailDataRequired } from '@sendgrid/mail'

import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config'
import { User } from '../models/entities/User'
import { createAuthTokens } from '../utils/createAuthTokens'
import { MyContext } from '../MyContext'
import { newBiolinkValidation } from './biolink.controller'
import { BlackList } from '../models/entities/BlackList'
import { BlacklistType } from '../models/enums/BlacklistType'
import { createReferralCode } from './code.controller'
import sgMail from '../utils/sendMail'
import { FRONTEND_APP_URL } from '../config/app.config'
import { BooleanResponse } from '../typeDefs/common.typeDef'
import { captureUserActivity } from './logs.controller'
import { NewBiolinkInput } from '../typeDefs/biolink.typeDef'
import {
  RegisterInput,
  UserResponse,
  LoginInput,
  EmailInput,
  ChangePasswordInput,
  PasswordInput,
} from '../typeDefs/user.typeDef'
import { ErrorCode } from '../constants/errorCodes'

export const validateUserRegistration = async (
  userOptions: RegisterInput,
  biolinkOptions: NewBiolinkInput
): Promise<BooleanResponse> => {
  const userInputValidationReport = await userInputValidation(userOptions)
  if (!userInputValidationReport.executed) {
    return userInputValidationReport
  }

  const biolinkInputValidationReport = await newBiolinkValidation(biolinkOptions)
  if (!biolinkInputValidationReport.executed) {
    return biolinkInputValidationReport
  }

  return { executed: true }
}

export const userInputValidation = async (userOptions: RegisterInput): Promise<BooleanResponse> => {
  // TODO: If new user registration is not enabled

  // Validate input
  const validationErrors = await validate(userOptions)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  // Blacklist email checks
  const blacklisted = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Email, keyword: userOptions.email },
  })

  if (blacklisted) {
    return {
      errors: [
        {
          field: 'email',
          errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'Cannot create new account.',
        },
      ],
      executed: false,
    }
  }

  // Check existing email
  const user = await User.findOne({ where: { email: userOptions.email } })
  if (user) {
    return {
      errors: [
        {
          field: 'email',
          errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'User with this email address already exists.',
        },
      ],
      executed: false,
    }
  }

  return {
    executed: true,
  }
}

export const registerUser = async (
  userOptions: RegisterInput,
  context: MyContext
): Promise<UserResponse> => {
  // Validating user input
  const userInputValidationReport = await userInputValidation(userOptions)

  if (!userInputValidationReport.executed) {
    return {
      errors: userInputValidationReport.errors,
    }
  }

  // Creating user
  const hashedPassword = await argon2.hash(userOptions.password as string)

  // Saving user password and resetting forgotPasswordCode
  const encryptedForgotPasswordCode = await argon2.hash(randToken.generate(160))

  const user = await User.create({
    name: userOptions.name,
    email: userOptions.email,
    encryptedPassword: hashedPassword,
    forgotPasswordCode: encryptedForgotPasswordCode,
    totalLogin: 1,
  }).save()

  await createReferralCode(user)

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  // Capture user log
  await captureUserActivity(user, context, 'User Registered')

  // send verification email
  await sendEmailForVerification(user, context)

  // Send email to admins, if new user email is checked

  return { user }
}

export const sendEmailForVerification = async (
  user: User,
  context: MyContext
): Promise<BooleanResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  let emailActivationCode = randToken.generate(132)
  let userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })

  while (userWithSameActivationCode) {
    emailActivationCode = randToken.generate(132)
    userWithSameActivationCode = await User.findOne({ where: { emailActivationCode } })
  }

  user.emailActivationCode = emailActivationCode
  await user.save()

  const emailActivationMailData: MailDataRequired = {
    to: {
      name: user.name,
      email: user.email,
    },
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Verify Your Email Address`,
    html: `Click <a href="${FRONTEND_APP_URL}/auth/email_verification?token=${emailActivationCode}" target="_blank">here</a> to verify your email address.`,
  }

  await sgMail.send(emailActivationMailData, false, (err) => {
    return {
      errors: [
        {
          message: err.message,
        },
      ],
    }
  })

  // Capture user log
  await captureUserActivity(user, context, 'Requested User Email Verification')

  return {
    executed: true,
  }
}

export const verifyEmailByActivationCode = async (
  emailActivationCode: string,
  context: MyContext
): Promise<BooleanResponse> => {
  const user = await User.findOne({ where: { emailActivationCode } })

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid token',
        },
      ],
      executed: false,
    }
  }

  let newEmailActivationCode = randToken.generate(132)
  let userWithSameActivationCode = await User.findOne({ where: { newEmailActivationCode } })

  while (userWithSameActivationCode) {
    newEmailActivationCode = randToken.generate(132)
    userWithSameActivationCode = await User.findOne({ where: { newEmailActivationCode } })
  }

  user.emailVerifiedAt = moment().toDate()
  user.emailActivationCode = newEmailActivationCode
  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'Email has been verified')

  return {
    executed: true,
  }
}

export const sendForgotPasswordVerificationEmail = async (
  options: EmailInput,
  context: MyContext
): Promise<BooleanResponse> => {
  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
          message: 'No user found with this email address',
        },
      ],
      executed: false,
    }
  }

  const forgotPasswordCode = randToken.generate(160)

  user.forgotPasswordCode = await argon2.hash(forgotPasswordCode)
  await user.save()

  const forgetPasswordMailData: MailDataRequired = {
    to: {
      name: user.name,
      email: user.email,
    },
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Reset Your Stashee Password`,
    html: `Click <a href="${FRONTEND_APP_URL}/auth/reset_password?email=${user.email}&token=${forgotPasswordCode}" target="_blank">here</a> to reset your Stashee Password.`,
  }

  await sgMail.send(forgetPasswordMailData, false, (err) => {
    return {
      errors: [
        {
          message: err.message,
        },
      ],
    }
  })

  // Capture user log
  await captureUserActivity(user, context, 'Requested Forgot Password Verification Email')

  return {
    executed: true,
  }
}

export const verifyForgotPassword = async (
  options: LoginInput,
  forgotPasswordCode: string,
  context: MyContext
): Promise<BooleanResponse> => {
  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
          message: 'Invalid email address',
        },
      ],
      executed: false,
    }
  }

  if (forgotPasswordCode === null || forgotPasswordCode === '') {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid forgot password code',
        },
      ],
      executed: false,
    }
  }

  const verified = await argon2.verify(user.forgotPasswordCode, forgotPasswordCode)

  if (!verified) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: 'Invalid token',
        },
      ],
      executed: false,
    }
  }

  // Saving user password and resetting forgotPasswordCode
  const newForgotPasswordCode = randToken.generate(160)

  user.encryptedPassword = await argon2.hash(options.password)
  user.forgotPasswordCode = await argon2.hash(newForgotPasswordCode)
  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'Password has been reset successfully')

  return {
    executed: true,
  }
}

export const loginUser = async (options: LoginInput, context: MyContext): Promise<UserResponse> => {
  // Predefined validation errors
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  const user = await User.findOne({ where: { email: options.email } })

  if (!user) {
    return {
      errors: [
        {
          field: 'email',
          errorCode: ErrorCode.EMAIL_COULD_NOT_BE_FOUND,
          message: 'User with this email does not exist',
        },
      ],
    }
  }

  const passwordVerified = await argon2.verify(user.encryptedPassword, options.password as string)

  if (!passwordVerified) {
    return {
      errors: [
        {
          field: 'password',
          errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
          message: 'Password did not match',
        },
      ],
    }
  }

  // Implement jwt
  const { refreshToken, accessToken } = await createAuthTokens(user)

  context.res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
  context.res.cookie('access_token', accessToken, accessTokenCookieOptions)

  user.totalLogin++

  await user.save()

  // Capture user log
  await captureUserActivity(user, context, 'User logs in')

  return { user }
}

export const logoutUser = async (context: MyContext, user: User): Promise<BooleanResponse> => {
  if (!user)
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Invalid request',
        },
      ],
      executed: false,
    }

  user.tokenCode = ''
  await user.save()

  context.res.cookie('refresh_token', '', refreshTokenCookieOptions)
  context.res.cookie('access_token', '', accessTokenCookieOptions)

  // Capture user log
  await captureUserActivity(user, context, 'User logs out')

  return {
    executed: true,
  }
}

export const changeUserEmail = async (
  options: EmailInput,
  user: User,
  context: MyContext
): Promise<BooleanResponse> => {
  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  const otherUser = await User.findOne({ where: { email: options.email } })

  if (otherUser && otherUser.id !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'User with this email already exists',
        },
      ],
      executed: false,
    }
  }

  user.email = options.email
  user.emailVerifiedAt = null

  sendEmailForVerification(user, context)

  await user.save()

  return {
    executed: true,
  }
}

export const changeUserPassword = async (
  options: ChangePasswordInput,
  user: User
): Promise<BooleanResponse> => {
  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  const isVerified = await argon2.verify(user.encryptedPassword, options.oldPassword)

  if (!isVerified) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
          message: 'Password did not match',
        },
      ],
      executed: false,
    }
  }

  const encryptedPassword = await argon2.hash(options.newPassword)

  user.encryptedPassword = encryptedPassword

  await user.save()

  return {
    executed: true,
  }
}

export const deleteUserAccount = async (
  options: PasswordInput,
  user: User,
  context: MyContext
): Promise<BooleanResponse> => {
  // Validate input
  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
      executed: false,
    }
  }

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  const isVerified = await argon2.verify(user.encryptedPassword, options.password)

  if (!isVerified) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
          message: 'Password did not match',
        },
      ],
      executed: false,
    }
  }

  logoutUser(context, user)

  await user.softRemove()

  return {
    executed: true,
  }
}
