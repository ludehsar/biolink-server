import { captureUserActivity } from '../../services'
import { User, Link } from '../../entities'
import { LinkListResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getAllUserLinks = async (
  user: User,
  context: MyContext
): Promise<LinkListResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const links = await Link.find({
    where: {
      user,
    },
    order: {
      createdAt: 'DESC',
    },
  })

  await captureUserActivity(user, context, `Requested all user links`, false)

  return { links }
}
