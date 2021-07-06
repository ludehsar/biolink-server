import { UsernameResponse } from '../../object-types'
import { Username, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getUsername = async (
  usernameId: string,
  adminUser: User,
  context: MyContext
): Promise<UsernameResponse> => {
  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const username = await Username.findOne(usernameId)

  if (!username) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_NOT_FOUND,
          message: 'Username not found',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'username'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShow) &&
    adminRole.roleName !== 'Administrator'
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

  await captureUserActivity(adminUser, context, `Requested username ${username.id}`, false)

  return { username }
}
