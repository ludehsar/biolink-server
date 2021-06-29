import { ErrorCode, MyContext } from '../../types'
import { NewAdminRoleInput } from '../../input-types'
import { AdminRole, User } from '../../entities'
import { AdminRoleResponse } from '../../object-types'
import { validate } from 'class-validator'
import { captureUserActivity } from '../../services'

export const createAdminRole = async (
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

  try {
    const newAdminRole = await AdminRole.create({
      roleName: options.roleName,
      roleDescription: options.roleDescription,
      roleSettings: options.roleSettings,
    }).save()

    await captureUserActivity(
      adminUser,
      context,
      `Created new admin role ${newAdminRole.roleName}`,
      true
    )

    return { adminRole: newAdminRole }
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
