import { validate } from 'class-validator'
import { User, Biolink, Plan } from '../../entities'
import { SEOInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const updateSEOSettings = async (
  id: string,
  options: SEOInput,
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

  if (planSettings.seoEnabled) {
    biolinkSettings.blockSearchEngineIndexing = options.blockSearchEngineIndexing || false
    biolinkSettings.pageTitle = options.pageTitle || ''
    biolinkSettings.metaDescription = options.metaDescription || ''
    biolinkSettings.opengraphImageUrl = options.opengraphImageUrl || '' // TODO: Image upload
  } else {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Enabling SEO is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated seo settings of biolink: ${biolink.username}`,
    true
  )

  return { biolink }
}
