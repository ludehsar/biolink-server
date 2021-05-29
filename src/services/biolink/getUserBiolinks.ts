import { User, Biolink } from 'entities'
import { BiolinkListResponse } from 'object-types'
import { ErrorCode } from 'types'

export const getUserBiolinks = async (user: User): Promise<BiolinkListResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  const biolinks = await Biolink.find({ where: { user } })

  return { biolinks }
}
