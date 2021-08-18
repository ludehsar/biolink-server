import { Biolink, Follow, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '..'

export const unfollowBiolink = async (
  followingBiolinkId: string,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
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

  const biolink = await Biolink.findOne(followingBiolinkId)

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

  if (follow) {
    await follow.remove()

    await captureUserActivity(
      user,
      context,
      `Unfollowed biolink ${(await biolink.username)?.username}`,
      true
    )
  }

  return {}
}
