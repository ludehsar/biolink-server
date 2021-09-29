import { TaxResponse } from '../../object-types'
import { AdminRole, Tax, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getTax = async (
  taxId: number,
  adminUser: User,
  context: MyContext
): Promise<TaxResponse> => {
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

  const tax = await Tax.findOne(taxId)

  if (!tax) {
    return {
      errors: [
        {
          errorCode: ErrorCode.TAX_NOT_FOUND,
          message: 'Invalid tax id',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'tax'
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

  await captureUserActivity(adminUser, context, `Requested tax ${tax.id}`, false)

  return { tax }
}
