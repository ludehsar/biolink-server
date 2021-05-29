import { User, Biolink } from 'entities'
import { validate } from 'class-validator'
import { PrivacyInput } from 'input-types'
import { BiolinkResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'
import argon2 from 'argon2'

export const updatePrivacySettings = async (
  id: string,
  options: PrivacyInput,
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
  biolinkSettings.enablePasswordProtection = options.enablePasswordProtection || false
  biolinkSettings.enableSensitiveContentWarning = options.enableSensitiveContentWarning || false
  biolinkSettings.password = await argon2.hash(options.password || '')

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated privacy settings of biolink: ${biolink.username}`
  )

  return { biolink }
}
