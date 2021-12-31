import { Service } from 'typedi'

import { Settings } from '../entities'
import {
  AdsSettingsInput,
  BusinessSettingsInput,
  CaptchaSettingsInput,
  EmailSettingsInput,
  FacebookSettingsInput,
  LinkSettingsInput,
  MainSettingsInput,
  NotificationSettingsInput,
  PaymentSettingsInput,
  SocialSettingsInput,
} from '../input-types'
import { SettingsService } from '../services/settings.service'

@Service()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  async getSettingsByKey(key: string): Promise<Settings> {
    return await this.settingsService.getSettingsByKey(key)
  }

  async updateSettingsByKey(
    key: string,
    input:
      | AdsSettingsInput
      | BusinessSettingsInput
      | CaptchaSettingsInput
      | EmailSettingsInput
      | FacebookSettingsInput
      | LinkSettingsInput
      | MainSettingsInput
      | NotificationSettingsInput
      | PaymentSettingsInput
      | SocialSettingsInput
  ): Promise<Settings> {
    return await this.settingsService.updateSettingsByKey(key, input)
  }
}
