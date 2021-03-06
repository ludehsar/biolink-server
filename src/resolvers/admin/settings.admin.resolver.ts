import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
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
} from '../../input-types'
import { Settings } from '../../entities'
import { SettingsController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { SettingsRecordUnion } from '../../json-types'

@Resolver()
export class SettingsAdminResolver {
  constructor(private readonly settingsController: SettingsController) {}

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editAdsSettings(
    @Arg('options', () => AdsSettingsInput) options: AdsSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('ads', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editBusinessSettings(
    @Arg('options', () => BusinessSettingsInput) options: BusinessSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('business', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editCaptchaSettings(
    @Arg('options', () => CaptchaSettingsInput) options: CaptchaSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('captcha', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editEmailSettings(
    @Arg('options', () => EmailSettingsInput) options: EmailSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('email', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editFacebookSettings(
    @Arg('options', () => FacebookSettingsInput) options: FacebookSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('facebook_login', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editLinkSettings(
    @Arg('options', () => LinkSettingsInput) options: LinkSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('links', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editMainSettings(
    @Arg('options', () => MainSettingsInput) options: MainSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('main', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editNotificationSettings(
    @Arg('options', () => NotificationSettingsInput) options: NotificationSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('email_notification', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editPaymentSettings(
    @Arg('options', () => PaymentSettingsInput) options: PaymentSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('payments', options)
  }

  @Mutation(() => Settings)
  @UseMiddleware(authAdmin('settings.canEdit'))
  async editSocialSettings(
    @Arg('options', () => SocialSettingsInput) options: SocialSettingsInput
  ): Promise<Settings> {
    return await this.settingsController.updateSettingsByKey('socials', options)
  }

  @Query(() => SettingsRecordUnion)
  @UseMiddleware(authAdmin('settings.canShow'))
  async getSettingsByKey(@Arg('key', () => String) key: string): Promise<any> {
    return await (
      await this.settingsController.getSettingsByKey(key)
    ).value
  }
}
