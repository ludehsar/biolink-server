import { validate } from 'class-validator'
import { User, Biolink, Plan } from '../../entities'
import { BrandingInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const updateBrandingSettings = async (
  id: string,
  options: BrandingInput,
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

  // TODO: change according to plan
  if (planSettings.removableBrandingEnabled)
    biolinkSettings.removeDefaultBranding = options.removeDefaultBranding || false
  else if (options.removeDefaultBranding === true) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Removing brand is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  if (planSettings.customFooterBrandingEnabled) {
    biolinkSettings.enableCustomBranding = options.enableCustomBranding || false
    biolinkSettings.customBrandingName = options.customBrandingName || ''
    biolinkSettings.customBrandingUrl = options.customBrandingUrl || ''
  } else if (
    (options.enableCustomBranding !== undefined && options.enableCustomBranding) ||
    (options.customBrandingName !== undefined && options.customBrandingName.trim().length > 0) ||
    (options.customBrandingUrl !== undefined && options.customBrandingUrl.trim().length > 0)
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Enabling custom brand is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(user, context, `Updated brand settings of biolink: ${biolink.username}`)

  return { biolink }
}
