import { validate } from 'class-validator'
import { getRepository } from 'typeorm'
import { User, BlackList, Biolink, PremiumUsername, Plan } from '../../entities'
import { BlacklistType } from '../../enums'
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

    return errors
  }

  // Checks authorization
  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })
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
