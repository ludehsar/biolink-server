import { BlackListResponse } from '../../object-types'
import { AdminRole, BlackList, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewBlackListInput } from '../../input-types'

export const editBlackList = async (
  blackListId: number,
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

  const adminRole = (await adminUser.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'blackList'
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

  try {
    if (options.blacklistType) blackList.blacklistType = options.blacklistType
    if (options.keyword) blackList.keyword = options.keyword
    blackList.reason = options.reason || ''

    await blackList.save()

    await captureUserActivity(adminUser, context, `Edited blackList ${blackList.id}`, true)

    return { blackList }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }
}
