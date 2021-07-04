import { SupportResponse } from '../../object-types'
import { Support, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { SupportAdminInput } from '../../input-types'
import { ResolveStatus } from '../../enums'

export const editSupport = async (
  supportId: string,
  options: SupportAdminInput,
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

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'support'
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

  support.status = options.status || ResolveStatus.Pending
  support.supportReply = options.supportReply || ''
  await support.save()

  await captureUserActivity(
    adminUser,
    context,
    `Changed support status of ${support.id} to ${support.status}`,
    true
  )

  return { support }
}
