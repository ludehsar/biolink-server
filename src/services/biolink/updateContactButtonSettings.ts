import { validate } from 'class-validator'
import { User, Biolink, Plan } from '../../entities'
import { ContactButtonInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const updateContactButtonSettings = async (
  id: string,
  options: ContactButtonInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
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

  const biolink = await Biolink.findOne(id)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const plan = (await user.plan) || Plan.findOne({ where: { name: 'Free' } })

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not defined',
        },
      ],
    }
  }

  const planSettings = plan.settings || {}

  const biolinkSettings = biolink.settings || {}

  if (planSettings.coloredLinksEnabled) {
    biolinkSettings.enableColoredContactButtons = options.enableColoredContactButtons || false
  } else if (
    options.enableColoredContactButtons !== undefined &&
    options.enableColoredContactButtons
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Colored links are not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  biolinkSettings.showEmail = options.showEmail || false
  biolinkSettings.showPhone = options.showPhone || false
  biolinkSettings.email = options.email || ''
  biolinkSettings.phone = options.phone || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated contact button settings of biolink: ${biolink.username}`,
    true
  )

  return { biolink }
}
