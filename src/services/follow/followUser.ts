import { Follow, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '..'

export const followUser = async (
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

  if (!follow) {
    const newFollow = Follow.create()

    newFollow.follower = Promise.resolve(user)
    newFollow.followee = Promise.resolve(otherUser)

    await newFollow.save()

    await captureUserActivity(user, context, `Started following user ${otherUser.id}`, true)
  }

  return {}
}
