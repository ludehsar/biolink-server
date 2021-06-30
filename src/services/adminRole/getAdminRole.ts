import { ErrorCode, MyContext } from '../../types'
import { AdminRole, User } from '../../entities'
import { AdminRoleResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const getAdminRole = async (
  id: number,
  adminUser: User,
  context: MyContext
): Promise<AdminRoleResponse> => {
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
    return role.resource === 'adminRole'
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

  const requiredAdminRole = await AdminRole.findOne(id)

  if (!requiredAdminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.ADMIN_ROLE_NOT_FOUND,
          message: 'Admin role not found',
        },
      ],
    }
  }

  await captureUserActivity(
    adminUser,
    context,
    `Requested admin role ${requiredAdminRole.roleName}`,
    false
  )

  return { adminRole: requiredAdminRole }
}
