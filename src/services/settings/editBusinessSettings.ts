import { BusinessSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { BusinessSettingsInput } from '../../input-types'
import { BusinessSystemSettings } from '../../json-types'

export const editBusinessSettings = async (
  options: BusinessSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<BusinessSettingsResponse> => {
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

  if (!adminRole || adminRole.roleName !== 'Administrator') {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  let business = await Settings.findOne({ where: { key: 'business' } })

  if (!business) {
    business = await Settings.create({
      key: 'business',
    }).save()
  }

  const businessSettings = business.value as BusinessSystemSettings

  businessSettings.address = options.address || ''
  businessSettings.city = options.city || ''
  businessSettings.country = options.country || ''
  businessSettings.email = options.email || ''
  businessSettings.enableInvoice = options.enableInvoice || false
  businessSettings.name = options.name || ''
  businessSettings.phone = options.phone || ''
  businessSettings.taxId = options.taxId || ''
  businessSettings.taxType = options.taxType || ''
  businessSettings.zipCode = options.zipCode || ''

  business.value = businessSettings
  await business.save()

  await captureUserActivity(adminUser, context, `Changed business settings`, false)

  return { settings: businessSettings }
}
