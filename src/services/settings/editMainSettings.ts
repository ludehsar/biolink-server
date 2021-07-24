import { MainSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { MainSettingsInput } from '../../input-types'
import { MainSystemSettings } from '../../json-types'

export const editMainSettings = async (
  options: MainSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<MainSettingsResponse> => {
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

  let main = await Settings.findOne({ where: { key: 'main' } })

  if (!main) {
    main = await Settings.create({
      key: 'main',
    }).save()
  }

  const mainSettings = (main.value || {}) as MainSystemSettings

  mainSettings.defaultLanguage = options.defaultLanguage || ''
  mainSettings.defaultTimezone = options.defaultTimezone || ''
  mainSettings.enableEmailConfirmation = options.enableEmailConfirmation || false
  mainSettings.enableNewUserRegistration = options.enableNewUserRegistration || false
  mainSettings.privacyPolicyUrl = options.privacyPolicyUrl || ''
  mainSettings.termsAndConditionsUrl = options.termsAndConditionsUrl || ''
  mainSettings.title = options.title || ''

  main.value = mainSettings
  await main.save()

  await captureUserActivity(adminUser, context, `Changed main settings`, true)

  return { settings: mainSettings }
}
