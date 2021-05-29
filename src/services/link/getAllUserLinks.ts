import { User, Link } from '../../entities'
import { LinkListResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getAllUserLinks = async (user: User): Promise<LinkListResponse> => {
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

  return { links }
}
