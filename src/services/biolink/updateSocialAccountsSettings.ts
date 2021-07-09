import { validate } from 'class-validator'
import { SocialAccountStyleType } from '../../enums'
import { BACKEND_URL } from '../../config'
import { User, Biolink, Plan } from '../../entities'
import { SingleSocialAccount, SocialAccountsInput } from '../../input-types'
import { BiolinkResponse, ErrorResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { isMalicious } from '../../utilities'

export const updateSocialAccountsSettings = async (
  id: string,
  options: SocialAccountsInput,
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

  let errors: ErrorResponse[] = []

  for (let i = 0; i < (options.socialAccounts || []).length; ++i) {
    const socialAccountValidationError = await validate(
      (options.socialAccounts as SingleSocialAccount[])[i]
    )

    if (socialAccountValidationError.length > 0) {
      errors = socialAccountValidationError.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      }))
    }
  }

  if (errors.length > 0) {
    return {
      errors,
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

  if (options.socialAccounts) {
    const malicious = await isMalicious(options.socialAccounts.map((link) => link.link || '#'))

    if (malicious) {
      return {
        errors: [
          {
            errorCode: ErrorCode.LINK_IS_MALICIOUS,
            message: 'Malicious links detected',
          },
        ],
      }
    }
  }

  const planSettings = plan.settings || {}

  const biolinkSettings = biolink.settings || {}

  if (planSettings.socialEnabled) {
    if (planSettings.coloredLinksEnabled) {
      biolinkSettings.enableColoredSocialMediaIcons = options.enableColoredSocialMediaIcons || false
    } else if (options.enableColoredSocialMediaIcons) {
      return {
        errors: [
          {
            errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
            message:
              'Colored link is not supported with the current plan. Please upgrade your plan to continue.',
          },
        ],
      }
    }
    biolinkSettings.socialAccountStyleType =
      options.socialAccountStyleType || SocialAccountStyleType.Round
    biolinkSettings.socialAccounts =
      options.socialAccounts?.map((option) => ({
        link: option.link || '#',
        platform: option.platform || 'Unknown',
        icon: BACKEND_URL + `/static/socialIcons/${option.platform}.png`,
      })) || []
  } else {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Social accounts is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated social buttons settings of biolink: ${biolink.username}`,
    true
  )

  return { biolink }
}
