import { validate } from 'class-validator'
import { User, Biolink, Plan } from '../../entities'
import { IntegrationInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const updateIntegrationSettings = async (
  id: string,
  options: IntegrationInput,
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

  if (planSettings.facebookPixelEnabled) {
    biolinkSettings.enableFacebookPixel = options.enableFacebookPixel || false
    biolinkSettings.facebookPixelId = options.facebookPixelId || ''
  } else if (
    (options.enableFacebookPixel !== undefined && options.enableFacebookPixel) ||
    (options.facebookPixelId !== undefined && options.facebookPixelId.trim().length > 0)
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Enabling Facebook pixel is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }
  if (planSettings.googleAnalyticsEnabled) {
    biolinkSettings.enableGoogleAnalytics = options.enableGoogleAnalytics || false
    biolinkSettings.googleAnalyticsCode = options.googleAnalyticsCode || ''
  } else if (
    (options.enableGoogleAnalytics !== undefined && options.enableGoogleAnalytics) ||
    (options.googleAnalyticsCode !== undefined && options.googleAnalyticsCode.trim().length > 0)
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Enabling Google analytics is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated integration settings of biolink: ${biolink.username}`
  )

  return { biolink }
}
