import { IsNull, Not } from 'typeorm'
import { ErrorCode } from '../../types'
import { User } from '../../entities'
import { UsersAdminsCountResponse } from '../../object-types'

export const getUsersAndAdminsCountData = async (
  adminUser: User
): Promise<UsersAdminsCountResponse> => {
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

  if (!adminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  const totalUsers = await User.count({ where: { adminRole: IsNull() } })
  const totalAdmins = await User.count({ where: { adminRole: Not(IsNull()) } })

  return {
    result: {
      totalAdmins,
      totalUsers,
    },
  }
}
