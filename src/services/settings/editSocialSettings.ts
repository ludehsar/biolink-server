import { SocialSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { SocialSettingsInput } from '../../input-types'
import { SocialSystemSettings } from '../../json-types'

export const editSocialSettings = async (
  options: SocialSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<SocialSettingsResponse> => {
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

  let social = await Settings.findOne({ where: { key: 'social' } })

  if (!social) {
    social = await Settings.create({
      key: 'social',
    }).save()
  }

  const socialSettings = social.value as SocialSystemSettings

  socialSettings.facebook = options.facebook || ''
  socialSettings.instagram = options.instagram || ''
  socialSettings.twitter = options.twitter || ''
  socialSettings.youtube = options.youtube || ''

  social.value = socialSettings
  await social.save()

  await captureUserActivity(adminUser, context, `Changed social settings`, false)

  return { settings: socialSettings }
}
