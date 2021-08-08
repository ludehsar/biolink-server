import { ErrorCode, MyContext } from '../../types'
import { AdminRole, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const deleteAdminRole = async (
  id: number,
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
    return role.resource === 'adminRole'
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

  const deletedAdminRole = await AdminRole.findOne(id)

  if (!deletedAdminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.ADMIN_ROLE_NOT_FOUND,
          message: 'Admin role not found',
        },
      ],
    }
  }

  await deletedAdminRole.remove()
  await captureUserActivity(adminUser, context, `Deleted admin role ${id}`, false)

  return {}
}
