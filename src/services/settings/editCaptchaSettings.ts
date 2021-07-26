import { validate } from 'class-validator'
import { CaptchaSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { CaptchaSettingsInput } from '../../input-types'
import { CaptchaSystemSettings } from '../../json-types'
import { CaptchaType } from '../../enums'

export const editCaptchaSettings = async (
  options: CaptchaSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<CaptchaSettingsResponse> => {
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

  let captcha = await Settings.findOne({ where: { key: 'captcha' } })

  if (!captcha) {
    captcha = await Settings.create({
      key: 'captcha',
    }).save()
  }

  const captchaSettings = (captcha.value || {}) as CaptchaSystemSettings

  captchaSettings.captchaType = options.captchaType || CaptchaType.Basic
  captchaSettings.enableCaptchaOnLoginPage = options.enableCaptchaOnLoginPage || false
  captchaSettings.enableCaptchaOnLostPasswordPage = options.enableCaptchaOnLostPasswordPage || false
  captchaSettings.enableCaptchaOnRegisterPage = options.enableCaptchaOnRegisterPage || false
  captchaSettings.enableCaptchaOnResendActivationPage =
    options.enableCaptchaOnResendActivationPage || false

  captcha.value = captchaSettings
  await captcha.save()

  await captureUserActivity(adminUser, context, `Changed captcha settings`, true)

  return { settings: captchaSettings }
}
