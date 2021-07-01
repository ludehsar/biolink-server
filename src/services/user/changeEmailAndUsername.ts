import { validate } from 'class-validator'
import moment from 'moment'
import { User, BlackList, Username, Biolink } from '../../entities'
import { BlacklistType, PremiumUsernameType } from '../../enums'
import { EmailAndUsernameInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity, sendVerificationEmail } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const changeEmailAndUsername = async (
  options: EmailAndUsernameInput,
  biolinkId: string,
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

  const biolink = await Biolink.findOne(biolinkId)

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

  if (options.email && options.email !== user.email) {
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
    const currentUsername = await biolink.username

    if (options.username === currentUsername?.username) {
      return {}
    }

    if (biolink.changedUsername) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_ALREADY_CHANGED_ONCE,
            message:
              'Username already changed once, to change the username again, contact admin support',
          },
        ],
      }
    }

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

    const otherUsername = await Username.findOne({ where: { username: options.username } })
    const otherBiolink = await otherUsername?.biolink

    if (
      (otherBiolink && otherBiolink.id !== biolink.id) ||
      (otherUsername &&
        otherUsername.ownerId !== user.id &&
        moment(moment.now()).isBefore(otherUsername.expireDate))
    ) {
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
    const premiumUsername = await Username.findOne({
      where: [
        {
          username: options.username,
          premiumType: PremiumUsernameType.Premium,
        },
        {
          username: options.username,
          premiumType: PremiumUsernameType.Trademark,
        },
      ],
    })

    if (premiumUsername && premiumUsername.ownerId !== user.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
            field: 'username',
            message: 'Contact admin support to get this username.',
          },
        ],
      }
    }

    const oldUsername = await biolink.username

    if (oldUsername) {
      oldUsername.biolink = null
      oldUsername.expireDate = new Date(Date.now() + 12096e5)

      await oldUsername.save()
    }

    let username = await Username.findOne({ where: { username: options.username } })

    if (!username) {
      username = await Username.create({ username: options.username }).save()
    }

    biolink.changedUsername = true
    biolink.username = Promise.resolve(username)

    await biolink.save()

    username.biolink = Promise.resolve(biolink)
    username.owner = Promise.resolve(user)
    username.expireDate = null

    await username.save()
  }

  await captureUserActivity(user, context, `Changed emails or usernames or both`, true)

  return {}
}
