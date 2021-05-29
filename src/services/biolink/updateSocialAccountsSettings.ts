import { validate } from 'class-validator'
import { User, Biolink } from '../../entities'
import { SocialAccountsInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableColoredSocialMediaIcons = options.enableColoredSocialMediaIcons || false
  biolinkSettings.socialAccounts =
    options.socialAccounts?.map((option) => ({
      link: option.link || '#',
      platform: option.platform || 'Unknown',
    })) || []

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated social buttons settings of biolink: ${biolink.username}`
  )

  return { biolink }
}
