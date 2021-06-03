import { AdminRole } from '../../entities'
import { AdminRoleResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getAdminRoles = async (): Promise<AdminRoleResponse> => {
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

  return {
    adminRoles,
  }
}
