import { validate } from 'class-validator'
import { LinkSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { LinkSettingsInput } from '../../input-types'
import { LinkSystemSettings } from '../../json-types'

export const editLinkSettings = async (
  options: LinkSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<LinkSettingsResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

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

  let link = await Settings.findOne({ where: { key: 'link' } })

  if (!link) {
    link = await Settings.create({
      key: 'link',
    }).save()
  }

  const linkSettings = (link.value || {}) as LinkSystemSettings

  linkSettings.branding = options.branding || ''
  linkSettings.enableGoogleSafeBrowsing = options.enableGoogleSafeBrowsing || false
  linkSettings.enableLinkShortenerSystem = options.enableLinkShortenerSystem || false
  linkSettings.enablePhishtank = options.enablePhishtank || false

  link.value = linkSettings
  await link.save()

  await captureUserActivity(adminUser, context, `Changed link settings`, true)

  return { settings: linkSettings }
}
