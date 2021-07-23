import { CaptchaSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { CaptchaSystemSettings } from '../../json-types'

export const getCaptchaSettings = async (
  adminUser: User,
  context: MyContext
): Promise<CaptchaSettingsResponse> => {
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

  let captcha = await Settings.findOne({ where: { key: 'captcha' } })

  if (!captcha) {
    captcha = await Settings.create({
      key: 'captcha',
    }).save()
  }

  const captchaSettings = captcha.value as CaptchaSystemSettings

  await captureUserActivity(adminUser, context, `Requested captcha settings`, false)

  return { settings: captchaSettings }
}
