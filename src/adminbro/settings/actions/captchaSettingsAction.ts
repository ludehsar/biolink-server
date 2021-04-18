import { ApiClient, BaseRecord } from 'admin-bro'

import { CaptchaSystemSettings } from '../../../models/jsonTypes/CaptchaSystemSettings'

const api = new ApiClient()

export const fetchCaptchaSettings = (option: BaseRecord): CaptchaSystemSettings => {
  const captchaSystemSettings: CaptchaSystemSettings = {
    captchaType: option.params['value.captchaType'],
    enableCaptchaOnLoginPage: option.params['value.enableCaptchaOnLoginPage'],
    enableCaptchaOnLostPasswordPage: option.params['value.enableCaptchaOnLostPasswordPage'],
    enableCaptchaOnResendActivationPage: option.params['value.enableCaptchaOnResendActivationPage'],
  }

  return captchaSystemSettings
}

export const saveCaptchaSettings = async (options: CaptchaSystemSettings): Promise<void> => {
  await api
    .recordAction({
      resourceId: 'Settings',
      recordId: '5',
      actionName: 'edit',
      data: {
        value: options,
      },
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
