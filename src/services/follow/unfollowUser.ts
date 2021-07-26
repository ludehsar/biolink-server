import { Follow, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '..'

export const unfollowUser = async (
  followingId: string,
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

  const otherUser = await User.findOne(followingId)

  if (!otherUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User with this id not found',
        },
      ],
    }
  }

  const follow = await Follow.findOne({
    where: {
      followee: otherUser,
      follower: user,
    },
  })

  if (follow) {
    await follow.remove()

    await captureUserActivity(user, context, `Unfollowed user ${otherUser.id}`, true)
  }

  return {}
}