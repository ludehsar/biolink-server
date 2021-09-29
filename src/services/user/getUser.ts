import { ErrorCode, MyContext } from '../../types'
import { AdminRole, User } from '../../entities'
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

  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole

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

  await captureUserActivity(adminUser, context, `Requested user ${user.email}`, false)

  return { user }
}
