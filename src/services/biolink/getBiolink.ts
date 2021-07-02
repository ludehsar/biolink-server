import { ErrorCode, MyContext } from '../../types'
import { Biolink, User } from '../../entities'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const getBiolink = async (
  id: string,
  user: User,
  context: MyContext
): Promise<BiolinkResponse> => {
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

  const biolink = await Biolink.findOne(id)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  const adminRole = await user.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'biolink'
  })

  if (
    biolink.userId !== user.id ||
    ((!adminRole || !userSettings || !userSettings.canShow) &&
      adminRole.roleName !== 'Administrator')
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  await captureUserActivity(user, context, `Requested biolink ${biolink.id}`, false)

  return { biolink }
}
