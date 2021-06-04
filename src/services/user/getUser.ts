import { ErrorCode } from '../../types'
import { User } from '../../entities'
import { UserResponse } from '../../object-types'

export const getUser = async (id: string, adminUser: User): Promise<UserResponse> => {
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

  if (!adminRole || !userSettings || !userSettings.canShow) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  return { user }
}
