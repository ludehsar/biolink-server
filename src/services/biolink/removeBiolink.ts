import { User, Biolink } from 'entities'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const removeBiolink = async (
  username: string,
  context: MyContext,
  user: User
): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []

  const biolink = await Biolink.findOne({ where: { username } })

  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })

    return errors
  }

  if (!biolink) {
    errors.push({
      errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
      message: 'No biolink found with this username',
    })

    return errors
  }

  if (biolink.userId !== user.id) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHORIZED,
      message: 'User not authorized',
    })

    return errors
  }

  await biolink.softRemove()

  await captureUserActivity(user, context, `Removed biolink ${biolink.username}`)

  return errors
}
