import { validate } from 'class-validator'
import { User, Biolink, BlackList, PremiumUsername } from 'entities'
import { BlacklistType } from 'enums'
import { EmailAndUsernameInput } from 'input-types'
import { ErrorResponse } from 'object-types'
import { sendVerificationEmail } from 'services'
import { MyContext, ErrorCode } from 'types'

export const changeEmailAndUsername = async (
  options: EmailAndUsernameInput,
  username: string,
  user: User,
  context: MyContext
): Promise<ErrorResponse[]> => {
  let errors: ErrorResponse[] = []

  // Validate input
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

  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })

    return errors
  }

  const biolink = await Biolink.findOne({ where: { username } })

  if (!biolink || biolink.userId !== user.id) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHORIZED,
      message: 'User not authorized',
    })

    return errors
  }

  if (options.email) {
    const otherUser = await User.findOne({ where: { email: options.email } })

    if (otherUser && otherUser.id !== user.id) {
      errors.push({
        errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
        message: 'User with this email already exists',
      })

      return errors
    }

    user.email = options.email
    user.emailVerifiedAt = null

    sendVerificationEmail(user, context)

    await user.save()
  }

  if (options.username) {
    const otherBiolik = await Biolink.findOne({ where: { username: options.username } })

    if (otherBiolik && otherBiolik.id !== biolink.id) {
      errors.push({
        errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
        message: 'Biolink with this username already exists',
      })

      return errors
    }

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

      return errors
    }

    biolink.username = options.username

    await biolink.save()
  }

  return errors
}
