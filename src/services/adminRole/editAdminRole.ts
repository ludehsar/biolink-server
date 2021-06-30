import { ErrorCode, MyContext } from '../../types'
import { NewAdminRoleInput } from '../../input-types'
import { AdminRole, User } from '../../entities'
import { AdminRoleResponse } from '../../object-types'
import { validate } from 'class-validator'
import { captureUserActivity } from '../../services'

export const editAdminRole = async (
  id: number,
  options: NewAdminRoleInput,
  adminUser: User,
  context: MyContext
): Promise<AdminRoleResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

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
    (!adminRole || !userSettings || !userSettings.canEdit) &&
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

  const editedAdminRole = await AdminRole.findOne(id)

  if (!editedAdminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.ADMIN_ROLE_NOT_FOUND,
          message: 'Admin role not found',
        },
      ],
    }
  }

  try {
    editedAdminRole.roleName = options.roleName
    editedAdminRole.roleDescription = options.roleDescription
    editedAdminRole.roleSettings = options.roleSettings || []

    await editedAdminRole.save()

    await captureUserActivity(
      adminUser,
      context,
      `Edited admin role ${editedAdminRole.roleName}`,
      true
    )
    return { adminRole: editedAdminRole }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: err.message,
        },
      ],
    }
  }
}
