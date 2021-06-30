import { ErrorCode, MyContext } from '../../types'
import { User } from '../../entities'
import { UserResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const getUser = async (
  id: string,
  adminUser: User,
  context: MyContext
): Promise<UserResponse> => {
  const user = await User.findOne(id)

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User is not found',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
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

  await captureUserActivity(user, context, `Requested user ${user.email}`, false)

  return { user }
}
