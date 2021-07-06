import { BlackListResponse } from '../../object-types'
import { BlackList, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewBlackListInput } from '../../input-types'

export const addBlackList = async (
  options: NewBlackListInput,
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

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'blackList'
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
    const blackList = BlackList.create({
      blacklistType: options.blacklistType,
      keyword: options.keyword,
      reason: options.reason,
    })

    await blackList.save()

    await captureUserActivity(adminUser, context, `Created blackList ${blackList.id}`, true)

    return { blackList }
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
