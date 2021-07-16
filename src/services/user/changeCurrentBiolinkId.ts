import { UserResponse } from 'object-types'

import { ErrorCode, MyContext } from '../../types'
import { Biolink, User } from '../../entities'
import { captureUserActivity } from '../../services'

export const changeCurrentBiolinkId = async (
  biolinkId: string,
  user: User,
  context: MyContext
): Promise<UserResponse> => {
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

  const biolink = await Biolink.findOne(biolinkId)

  if (!biolink || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  user.currentBiolinkId = biolinkId
  await user.save()

  await captureUserActivity(user, context, `Changed current biolink id to ${biolinkId}`, false)

  return {
    user,
  }
}
