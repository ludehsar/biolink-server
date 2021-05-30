import { Biolink, PremiumUsername } from '../../entities'
import { BiolinkResponse } from '../../object-types'
import { trackBiolinkClicks } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const getBiolinkFromUsername = async (
  username: string,
  context: MyContext
): Promise<BiolinkResponse> => {
  const biolink = await Biolink.findOne({ where: { username } })
  const premiumUsername = await PremiumUsername.findOne({ where: { username } })

  if (!biolink || (premiumUsername && premiumUsername.ownerId !== biolink.userId)) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  await trackBiolinkClicks(biolink, context)

  return { biolink }
}
