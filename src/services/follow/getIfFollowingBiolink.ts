import { Biolink, Follow, User } from '../../entities'
import { FollowingResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getIfFollowingBiolink = async (
  biolinkId: string,
  user: User
): Promise<FollowingResponse> => {
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

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink with this id not found',
        },
      ],
    }
  }

  const follow = await Follow.findOne({
    where: {
      followee: biolink,
      follower: user,
    },
  })

  if (!follow) {
    return {
      following: false,
    }
  }

  return {
    following: true,
  }
}
