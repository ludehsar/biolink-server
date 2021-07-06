import { CodeResponse } from '../../object-types'
import { Code, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewCodeInput } from '../../input-types'
import { CodeType } from '../../enums'

export const editCode = async (
  codeId: string,
  options: NewCodeInput,
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
    if (options.code) code.code = options.code
    code.discount = options.discount || 0.0
    code.expireDate = options.expireDate || new Date()
    code.quantity = options.quantity || 0
    code.type = options.type || CodeType.Discount

    if (options.referrerId) {
      const user = await User.findOne(options.referrerId)

      if (!user) {
        return {
          errors: [
            {
              errorCode: ErrorCode.USER_NOT_FOUND,
              message: 'No user found with this id',
            },
          ],
        }
      }

      code.referrer = Promise.resolve(user)
    }

    await code.save()

    await captureUserActivity(adminUser, context, `Edited code ${code.id}`, true)

    return { code }
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
