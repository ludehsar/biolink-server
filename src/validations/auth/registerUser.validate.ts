import { validate } from 'class-validator'
import { BlackList, User, Code, Biolink, PremiumUsername } from 'entities'
import { BlacklistType } from 'enums'
import { RegisterInput } from 'input-types'
import { ErrorResponse } from 'object-types'
import { ErrorCode } from 'types'

export const registerUserValidated = async (
  options: RegisterInput,
  referralToken?: string
): Promise<ErrorResponse[]> => {
  let errors: ErrorResponse[] = []

  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    errors = errors.concat(
      validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      }))
    )

    return errors
  }

  // Validating the user
  // Blacklist email checks
  const blacklisted = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Email, keyword: options.email },
  })

  if (blacklisted) {
    errors.push({
      field: 'email',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
      message: 'Cannot create new account.',
    })

    return errors
  }

  // Check existing email
  const user = await User.findOne({ where: { email: options.email } })
  if (user) {
    errors.push({
      field: 'email',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
      message: 'User with this email address already exists.',
    })

    return errors
  }

  if (referralToken) {
    const code = await Code.findOne({
      where: {
        code: referralToken,
      },
    })

    if (!code) {
      errors.push({
        errorCode: ErrorCode.INVALID_TOKEN,
        message: 'Invalid referral token',
      })

      return errors
    }

    // Validating biolink
    // Checks blacklisted username
    const blacklisted = await BlackList.findOne({
      where: { blacklistType: BlacklistType.Username, keyword: options.username },
    })
    if (blacklisted) {
      errors.push({
        errorCode: ErrorCode.USERNAME_BLACKLISTED,
        field: 'username',
        message: 'Cannot create account with this username.',
      })

      return errors
    }

    // Checks if username already exists
    const biolink = await Biolink.findOne({ where: { username: options.username } })
    if (biolink) {
      errors.push({
        errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
        field: 'username',
        message: 'Username has already been taken.',
      })

      return errors
    }

    // Checks premium username which has not yet purchased
    const premiumUsername = await PremiumUsername.findOne({
      where: { username: options.username },
    })

    if (premiumUsername && premiumUsername.ownerId !== null) {
      errors.push({
        errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
        field: 'username',
        message: 'Username has already been taken.',
      })
    }
  }

  return errors
}
