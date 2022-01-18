import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { ApolloError } from 'apollo-server-express'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Settings } from '../entities'
import { ErrorCode } from '../types'
import { SettingsUpdateBody } from '../interfaces/SettingsUpdateBody'
import {
  AdsSystemSettings,
  BusinessSystemSettings,
  CaptchaSystemSettings,
  EmailSystemSettings,
  FacebookSystemSettings,
  LinkSystemSettings,
  MainSystemSettings,
  NotificationSystemSettings,
  PaymentSystemSettings,
  SocialSystemSettings,
} from '../json-types'

@Service()
export class SettingsService {
  constructor(
    @InjectRepository(Settings) private readonly settingsRepository: Repository<Settings>
  ) {}

  /**
   * Get settings by key
   * @param {string} key
   * @returns {Promise<Settings>}
   */
  async getSettingsByKey(key: string): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({
      where: {
        key,
      },
    })

    if (!settings) {
      throw new ApolloError('Invalid settings key', ErrorCode.DATABASE_ERROR)
    }

    return settings
  }

  /**
   * Get settings by key
   * @param {string} key
   * @param {string} updateBody
   * @returns {Promise<Settings>}
   */
  async updateSettingsByKey(key: string, updateBody: SettingsUpdateBody): Promise<Settings> {
    const settings = await this.getSettingsByKey(key)

    switch (key) {
      case 'ads': {
        const settingsValue = (settings.value || {}) as AdsSystemSettings

        if (updateBody.biolinkPageFooter !== undefined)
          settingsValue.biolinkPageFooter = updateBody.biolinkPageFooter
        if (updateBody.biolinkPageHeader !== undefined)
          settingsValue.biolinkPageHeader = updateBody.biolinkPageHeader
        if (updateBody.footer !== undefined) settingsValue.footer = updateBody.footer
        if (updateBody.header !== undefined) settingsValue.header = updateBody.header

        settings.value = settingsValue

        break
      }
      case 'business': {
        const settingsValue = (settings.value || {}) as BusinessSystemSettings

        if (updateBody.city !== undefined) settingsValue.city = updateBody.city
        if (updateBody.address !== undefined) settingsValue.address = updateBody.address
        if (updateBody.country !== undefined) settingsValue.country = updateBody.country
        if (updateBody.email !== undefined) settingsValue.email = updateBody.email
        if (updateBody.enableInvoice !== undefined)
          settingsValue.enableInvoice = updateBody.enableInvoice
        if (updateBody.name !== undefined) settingsValue.name = updateBody.name
        if (updateBody.phone !== undefined) settingsValue.phone = updateBody.phone
        if (updateBody.taxId !== undefined) settingsValue.taxId = updateBody.taxId
        if (updateBody.taxType !== undefined) settingsValue.taxType = updateBody.taxType
        if (updateBody.zipCode !== undefined) settingsValue.zipCode = updateBody.zipCode

        settings.value = settingsValue

        break
      }

      case 'captcha': {
        const settingsValue = (settings.value || {}) as CaptchaSystemSettings

        if (updateBody.captchaType !== undefined) settingsValue.captchaType = updateBody.captchaType
        if (updateBody.enableCaptchaOnLoginPage !== undefined)
          settingsValue.enableCaptchaOnLoginPage = updateBody.enableCaptchaOnLoginPage
        if (updateBody.enableCaptchaOnLostPasswordPage !== undefined)
          settingsValue.enableCaptchaOnLostPasswordPage = updateBody.enableCaptchaOnLostPasswordPage
        if (updateBody.enableCaptchaOnRegisterPage !== undefined)
          settingsValue.enableCaptchaOnRegisterPage = updateBody.enableCaptchaOnRegisterPage
        if (updateBody.enableCaptchaOnResendActivationPage !== undefined)
          settingsValue.enableCaptchaOnResendActivationPage =
            updateBody.enableCaptchaOnResendActivationPage

        settings.value = settingsValue

        break
      }

      case 'email': {
        const settingsValue = (settings.value || {}) as EmailSystemSettings

        if (updateBody.fromEmail !== undefined) settingsValue.fromEmail = updateBody.fromEmail
        if (updateBody.fromName !== undefined) settingsValue.fromName = updateBody.fromName

        settings.value = settingsValue

        break
      }

      case 'facebook_login': {
        const settingsValue = (settings.value || {}) as FacebookSystemSettings

        if (updateBody.enableFacebookLogin !== undefined)
          settingsValue.enableFacebookLogin = updateBody.enableFacebookLogin

        settings.value = settingsValue

        break
      }

      case 'links': {
        const settingsValue = (settings.value || {}) as LinkSystemSettings

        if (updateBody.branding !== undefined) settingsValue.branding = updateBody.branding
        if (updateBody.enableGoogleSafeBrowsing !== undefined)
          settingsValue.enableGoogleSafeBrowsing = updateBody.enableGoogleSafeBrowsing
        if (updateBody.enableLinkShortenerSystem !== undefined)
          settingsValue.enableLinkShortenerSystem = updateBody.enableLinkShortenerSystem
        if (updateBody.enablePhishtank !== undefined)
          settingsValue.enablePhishtank = updateBody.enablePhishtank

        settings.value = settingsValue

        break
      }

      case 'main': {
        const settingsValue = (settings.value || {}) as MainSystemSettings

        if (updateBody.defaultLanguage !== undefined)
          settingsValue.defaultLanguage = updateBody.defaultLanguage
        if (updateBody.defaultTimezone !== undefined)
          settingsValue.defaultTimezone = updateBody.defaultTimezone
        if (updateBody.enableEmailConfirmation !== undefined)
          settingsValue.enableEmailConfirmation = updateBody.enableEmailConfirmation
        if (updateBody.enableNewUserRegistration !== undefined)
          settingsValue.enableNewUserRegistration = updateBody.enableNewUserRegistration
        if (updateBody.privacyPolicyUrl !== undefined)
          settingsValue.privacyPolicyUrl = updateBody.privacyPolicyUrl
        if (updateBody.termsAndConditionsUrl !== undefined)
          settingsValue.termsAndConditionsUrl = updateBody.termsAndConditionsUrl
        if (updateBody.title !== undefined) settingsValue.title = updateBody.title

        settings.value = settingsValue

        break
      }

      case 'email_notification': {
        const settingsValue = (settings.value || {}) as NotificationSystemSettings

        if (updateBody.emailOnNewPayment !== undefined)
          settingsValue.emailOnNewPayment = updateBody.emailOnNewPayment
        if (updateBody.emailOnNewUser !== undefined)
          settingsValue.emailOnNewUser = updateBody.emailOnNewUser
        if (updateBody.emailsToBeNotified !== undefined)
          settingsValue.emailsToBeNotified = updateBody.emailsToBeNotified

        settings.value = settingsValue

        break
      }

      case 'payments': {
        const settingsValue = (settings.value || {}) as PaymentSystemSettings

        if (updateBody.brandName !== undefined) settingsValue.brandName = updateBody.brandName
        if (updateBody.currency !== undefined) settingsValue.currency = updateBody.currency
        if (updateBody.enableDiscountOrRedeemableCode !== undefined)
          settingsValue.enableDiscountOrRedeemableCode = updateBody.enableDiscountOrRedeemableCode
        if (updateBody.enablePaymentSystem !== undefined)
          settingsValue.enablePaymentSystem = updateBody.enablePaymentSystem
        if (updateBody.enablePaypal !== undefined)
          settingsValue.enablePaypal = updateBody.enablePaypal
        if (updateBody.enableStripe !== undefined)
          settingsValue.enableStripe = updateBody.enableStripe
        if (updateBody.enableTaxesAndBilling !== undefined)
          settingsValue.enableTaxesAndBilling = updateBody.enableTaxesAndBilling
        if (updateBody.enabledAcceptingPaymentType !== undefined)
          settingsValue.enabledAcceptingPaymentType = updateBody.enabledAcceptingPaymentType

        settings.value = settingsValue

        break
      }

      case 'socials': {
        const settingsValue = (settings.value || {}) as SocialSystemSettings

        if (updateBody.facebook !== undefined) settingsValue.facebook = updateBody.facebook
        if (updateBody.instagram !== undefined) settingsValue.instagram = updateBody.instagram
        if (updateBody.twitter !== undefined) settingsValue.twitter = updateBody.twitter
        if (updateBody.youtube !== undefined) settingsValue.youtube = updateBody.youtube

        settings.value = settingsValue

        break
      }

      default: {
        throw new ApolloError('Undefined system key', ErrorCode.DATABASE_ERROR)
      }
    }

    await settings.save()

    return settings
  }
}
