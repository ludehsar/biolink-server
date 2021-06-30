import { captureUserActivity } from '../../services'
import { User, Biolink } from '../../entities'
import { BiolinkListResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getUserBiolinks = async (
  user: User,
  context: MyContext
): Promise<BiolinkListResponse> => {
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

  await captureUserActivity(user, context, `Requested all user biolinks`, false)

  return { biolinks }
}
