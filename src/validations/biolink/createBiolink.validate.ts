import { validate } from 'class-validator'
import moment from 'moment'
import { getRepository } from 'typeorm'
import { User, BlackList, Biolink, Username, Plan } from '../../entities'
import { BlacklistType, PremiumUsernameType } from '../../enums'
import { NewBiolinkInput } from '../../input-types'
import { ErrorResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const createBiolinkValidated = async (
  options: NewBiolinkInput,
  user: User
): Promise<ErrorResponse[]> => {
  let errors: ErrorResponse[] = []

  const validationErrors = await validate(options)

  if (validationErrors.length > 0) {
    errors = errors.concat(
      validationErrors.map((err) => ({
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        field: err.property,
        message: 'Not correctly formatted',
      }))
    )

    return errors
  }

  // Checks authentication
  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })
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

  // Checks premium username
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
    errors.push({
      errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
      field: 'username',
      message: 'Contact to the admin support for this username.',
    })

    return errors
  }

  // Checks if username already exists
  const username = await Username.findOne({ where: { username: options.username } })
  const biolink = await username?.biolink

  if (
    biolink ||
    (username &&
      username.ownerId !== user.id &&
      username.expireDate !== null &&
      moment(moment.now()).isBefore(moment(username.expireDate)))
  ) {
    errors.push({
      errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
      field: 'username',
      message: 'Username has already been taken.',
    })

    return errors
  }

  // Checks plan
  const currentBiolinkCount = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .where('biolink.userId = :userId', { userId: user.id })
    .getCount()

  const plan = (await user.plan) || Plan.findOne({ where: { name: 'Free' } })

  if (!plan) {
    errors.push({
      errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
      message: 'Plan not defined',
    })

    return errors
  }

  const planSettings = plan.settings || {}

  if (
    planSettings.totalBiolinksLimit &&
    planSettings.totalBiolinksLimit !== -1 &&
    currentBiolinkCount >= planSettings.totalBiolinksLimit
  ) {
    errors.push({
      errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
      message: 'Maximum biolink limit reached. Please upgrade your account.',
    })
  }

  return errors
}
