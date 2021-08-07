import { ErrorCode, MyContext } from '../../types'
import { User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const deleteUser = async (
  id: string,
  adminUser: User,
  context: MyContext
): Promise<DefaultResponse> => {
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

  const adminRole = await adminUser.adminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canDelete) &&
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

  const user = await User.findOne(id)

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        },
      ],
    }
  }

  await user.softRemove()

  await captureUserActivity(adminUser, context, `User ${id} deleted.`, false)
  return {}
}
