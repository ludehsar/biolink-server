import { SupportResponse } from '../../object-types'
import { AdminRole, Support, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getSupport = async (
  supportId: string,
  adminUser: User,
  context: MyContext
): Promise<SupportResponse> => {
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

  const support = await Support.findOne(supportId)

  if (!support) {
    return {
      errors: [
        {
          errorCode: ErrorCode.SUPPORT_NOT_FOUND,
          message: 'Support not found',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'support'
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

  await captureUserActivity(adminUser, context, `Requested support ${support.id}`, false)

  return { support }
}
