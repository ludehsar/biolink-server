import { TaxResponse } from '../../object-types'
import { Tax, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewTaxInput } from '../../input-types'

export const addTax = async (
  options: NewTaxInput,
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

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'tax'
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

  const tax = await Tax.create({
    billingFor: options.billingFor,
    countries: options.countries,
    description: options.description,
    internalName: options.internalName,
    name: options.name,
    type: options.type,
    value: options.value,
    valueType: options.valueType,
  }).save()

  await captureUserActivity(adminUser, context, `Added new tax ${tax.id}`, true)

  return { tax }
}
