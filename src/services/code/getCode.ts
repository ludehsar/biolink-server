import { CodeResponse } from '../../object-types'
import { Code, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getCode = async (
  codeId: string,
  adminUser: User,
  context: MyContext
): Promise<CodeResponse> => {
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

  const code = await Code.findOne(codeId)

  if (!code) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CODE_NOT_FOUND,
          message: 'Code not found',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'code'
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

  await captureUserActivity(adminUser, context, `Requested code ${code.id}`, false)

  return { code }
}
