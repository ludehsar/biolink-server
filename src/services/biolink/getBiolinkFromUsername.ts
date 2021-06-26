import argon2 from 'argon2'
import { Username } from '../../entities'
import { BiolinkResponse } from '../../object-types'
import { trackBiolinkClicks } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const getBiolinkFromUsername = async (
  username: string,
  context: MyContext,
  password?: string
): Promise<BiolinkResponse> => {
  const availableUsername = await Username.findOne({ where: { username } })
  const biolink = await availableUsername?.biolink

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

  const biolinkSettings = biolink.settings || {}

  if (biolinkSettings.enablePasswordProtection) {
    if (!password) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USER_NOT_AUTHORIZED,
            message: 'Enter password to access the biolink',
          },
        ],
      }
    }

    const passwordVerified = await argon2.verify(biolinkSettings.password, password)

    if (!passwordVerified) {
      return {
        errors: [
          {
            errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
            message: 'Password did not match',
          },
        ],
      }
    }
  }

  await trackBiolinkClicks(biolink, context)

  return { biolink }
}
