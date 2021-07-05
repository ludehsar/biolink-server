import { TaxResponse } from '../../object-types'
import { Tax, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewTaxInput } from '../../input-types'
import { TaxBillingForType, TaxType, TaxValueType } from '../../enums'

export const editTax = async (
  taxId: number,
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

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'tax'
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

  tax.billingFor = options.billingFor || TaxBillingForType.Both
  tax.countries = options.countries || ''
  tax.description = options.description || ''
  tax.internalName = options.internalName || ''
  tax.name = options.name || ''
  tax.type = options.type || TaxType.Inclusive
  tax.value = options.value || 0.0
  tax.valueType = options.valueType || TaxValueType.Fixed

  await tax.save()

  await captureUserActivity(adminUser, context, `Edited tax ${tax.id}`, true)

  return { tax }
}
