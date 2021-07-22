import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import {
  AdsSettingsResponse,
  BusinessSettingsResponse,
  CaptchaSettingsResponse,
  EmailSettingsResponse,
  FacebookSettingsResponse,
  LinkSettingsResponse,
  MainSettingsResponse,
  NotificationSettingsResponse,
  PaymentSettingsResponse,
  SocialSettingsResponse,
} from '../../object-types'
import {
  editAdsSettings,
  editBusinessSettings,
  editCaptchaSettings,
  editEmailSettings,
  editFacebookSettings,
  editLinkSettings,
  editMainSettings,
  editNotificationSettings,
  editPaymentSettings,
  editSocialSettings,
} from '../../services'
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
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { MyContext } from '../../types'

@Resolver()
export class SettingsAdminResolver {
  @Mutation(() => AdsSettingsResponse)
  async editAdsSettings(
    @Arg('options', () => AdsSettingsInput) options: AdsSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<AdsSettingsResponse> {
    return await editAdsSettings(options, adminUser, context)
  }

  @Mutation(() => BusinessSettingsResponse)
  async editBusinessSettings(
    @Arg('options', () => BusinessSettingsInput) options: BusinessSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BusinessSettingsResponse> {
    return await editBusinessSettings(options, adminUser, context)
  }

  @Mutation(() => CaptchaSettingsResponse)
  async editCaptchaSettings(
    @Arg('options', () => CaptchaSettingsInput) options: CaptchaSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CaptchaSettingsResponse> {
    return await editCaptchaSettings(options, adminUser, context)
  }

  @Mutation(() => EmailSettingsResponse)
  async editEmailSettings(
    @Arg('options', () => EmailSettingsInput) options: EmailSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<EmailSettingsResponse> {
    return await editEmailSettings(options, adminUser, context)
  }

  @Mutation(() => FacebookSettingsResponse)
  async editFacebookSettings(
    @Arg('options', () => FacebookSettingsInput) options: FacebookSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<FacebookSettingsResponse> {
    return await editFacebookSettings(options, adminUser, context)
  }

  @Mutation(() => LinkSettingsResponse)
  async editLinkSettings(
    @Arg('options', () => LinkSettingsInput) options: LinkSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<LinkSettingsResponse> {
    return await editLinkSettings(options, adminUser, context)
  }

  @Mutation(() => MainSettingsResponse)
  async editMainSettings(
    @Arg('options', () => MainSettingsInput) options: MainSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<MainSettingsResponse> {
    return await editMainSettings(options, adminUser, context)
  }

  @Mutation(() => NotificationSettingsResponse)
  async editNotificationSettings(
    @Arg('options', () => NotificationSettingsInput) options: NotificationSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<NotificationSettingsResponse> {
    return await editNotificationSettings(options, adminUser, context)
  }

  @Mutation(() => PaymentSettingsResponse)
  async editPaymentSettings(
    @Arg('options', () => PaymentSettingsInput) options: PaymentSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PaymentSettingsResponse> {
    return await editPaymentSettings(options, adminUser, context)
  }

  @Mutation(() => SocialSettingsResponse)
  async editSocialSettings(
    @Arg('options', () => SocialSettingsInput) options: SocialSettingsInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<SocialSettingsResponse> {
    return await editSocialSettings(options, adminUser, context)
  }
}
