import { captureUserActivity } from '../../services'
import { AdminRole, User } from '../../entities'
import { AdminRoleListResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getAdminRoles = async (
  adminUser: User,
  context: MyContext
): Promise<AdminRoleListResponse> => {
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

  const adminRole = (await adminUser.adminRole) as AdminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'adminRole'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canCreate) &&
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

  const adminRoles = await AdminRole.find()

  if (!adminRoles) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }

  await captureUserActivity(adminUser, context, `Requested all admin roles`, false)

  return {
    adminRoles,
  }
}
