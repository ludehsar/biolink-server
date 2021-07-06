import { BlackListResponse } from '../../object-types'
import { BlackList, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getBlackList = async (
  blackListId: string,
  adminUser: User,
  context: MyContext
): Promise<BlackListResponse> => {
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

  const blackList = await BlackList.findOne(blackListId)

  if (!blackList) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BLACKLIST_NOT_FOUND,
          message: 'BlackList not found',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'blackList'
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

  await captureUserActivity(adminUser, context, `Requested blackList ${blackList.id}`, false)

  return { blackList }
}
