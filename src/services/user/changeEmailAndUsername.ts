import { validate } from 'class-validator'
import { User, Biolink, BlackList, PremiumUsername } from '../../entities'
import { BlacklistType } from '../../enums'
import { EmailAndUsernameInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { sendVerificationEmail } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const changeEmailAndUsername = async (
  options: EmailAndUsernameInput,
  username: string,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
  // Validate input
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

  const biolink = await Biolink.findOne({ where: { username } })

  if (!biolink || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  if (options.email) {
    const otherUser = await User.findOne({ where: { email: options.email } })

    if (otherUser && otherUser.id !== user.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
            message: 'User with this email already exists',
          },
        ],
      }
    }

    user.email = options.email
    user.emailVerifiedAt = null

    await sendVerificationEmail(user, context)

    await user.save()
  }

  if (options.username) {
    if (options.username.startsWith('0')) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
            message: 'Username already taken',
          },
        ],
      }
    }

    const otherBiolik = await Biolink.findOne({ where: { username: options.username } })

    if (otherBiolik && otherBiolik.id !== biolink.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
            message: 'Biolink with this username already exists',
          },
        ],
      }
    }

    // Checks blacklisted username
    const blacklisted = await BlackList.findOne({
      where: { blacklistType: BlacklistType.Username, keyword: options.username },
    })
    if (blacklisted) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_BLACKLISTED,
            field: 'username',
            message: 'Cannot create account with this username.',
          },
        ],
      }
    }

    // Checks premium username which has not yet purchased
    const premiumUsername = await PremiumUsername.findOne({
      where: { username: options.username },
    })

    if (premiumUsername && premiumUsername.ownerId !== null) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
            field: 'username',
            message: 'Username has already been taken.',
          },
        ],
      }
    }

    biolink.username = options.username

    await biolink.save()
  }

  return {}
}
