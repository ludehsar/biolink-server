import { FileUpload } from 'graphql-upload'
import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'
import axios from 'axios'
import * as argon2 from 'argon2'

import {
  BrandingInput,
  ConnectionArgs,
  ContactButtonInput,
  DarkModeInput,
  DirectoryInput,
  DonationInput,
  IntegrationInput,
  NewBiolinkInput,
  PrivacyInput,
  SEOInput,
  SocialAccountsInput,
  UpdateBiolinkProfileInput,
  UTMParameterInput,
} from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { Biolink, User } from '../entities'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { BlacklistType } from '../enums'
import { BlackListService } from '../services/blacklist.service'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'
import { CategoryService } from '../services/category.service'
import { appConfig } from '../config'
import { PlanService } from '../services/plan.service'
import { DirectorySearchResponse } from '../object-types'
import { TrackingService } from '../services/tracking.service'

@Service()
export class BiolinkController {
  constructor(
    private readonly biolinkService: BiolinkService,
    private readonly blacklistService: BlackListService,
    private readonly categoryService: CategoryService,
    private readonly planService: PlanService,
    private readonly trackingService: TrackingService,
    private readonly usernameService: UsernameService
  ) {}

  async createBiolink(biolinkInput: NewBiolinkInput, context: MyContext): Promise<Biolink> {
    if (await this.usernameService.isUsernameTaken(biolinkInput.username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    if (
      await this.blacklistService.isKeywordBlacklisted(
        biolinkInput.username,
        BlacklistType.Username
      )
    ) {
      throw new ApolloError('Username cannot be used', ErrorCode.USERNAME_BLACKLISTED)
    }

    if (await this.usernameService.isPremiumUsername(biolinkInput.username)) {
      throw new ApolloError('Premium username cannot be used', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const user = context.user as User

    const totalCurrentlyAvailableBiolinks = await this.biolinkService.countBiolinksByUserId(user.id)
    const totalAllowedBiolinks = (await this.planService.getValuesFromPlanSettingsByPlanId(
      user.planId,
      'totalBiolinksLimit'
    )) as number

    if (totalCurrentlyAvailableBiolinks >= totalAllowedBiolinks) {
      throw new ApolloError(
        'Maximum biolinks limit reached',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    const usernameDoc = await this.usernameService.findAvailableOneOrCreate(biolinkInput.username)
    const biolink = await this.biolinkService.createBiolink({
      user,
      username: usernameDoc,
    })

    return biolink
  }

  async getSearchQueries(query: string): Promise<DirectorySearchResponse> {
    return await this.biolinkService.directorySearchQueries(query)
  }

  async removeBiolink(biolinkId: string, context: MyContext): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    biolink = await this.biolinkService.softDeleteBiolinkById(biolink.id)

    return biolink
  }

  async getBiolinkFromUsername(
    username: string,
    context: MyContext,
    password?: string
  ): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkByUsername(username)

    if ((biolink.settings || {}).enablePasswordProtection) {
      if (await this.biolinkService.isPasswordMatched(biolink, password || '')) {
        return biolink
      } else {
        throw new ApolloError(
          'Enter correct password to get the biolink details',
          ErrorCode.PASSWORD_DID_NOT_MATCH
        )
      }
    }

    await this.trackingService.trackVisitors(biolink, context)

    return biolink
  }

  async getBiolink(biolinkId: string, context: MyContext): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return biolink
  }

  async getAllUserBiolinks(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkService.getAllBiolinksByUserId((context.user as User).id, options)
  }

  async getAllDirectories(
    options: ConnectionArgs,
    categoryIds: number[]
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkService.getAllDirectories(options, categoryIds)
  }

  async updateBiolinkProfile(
    biolinkId: string,
    biolinkProfileInput: UpdateBiolinkProfileInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    let category = undefined
    if (biolinkProfileInput.categoryId) {
      category = await this.categoryService.getCategoryByCategoryId(biolinkProfileInput.categoryId)
    }

    let latitude: number | undefined = undefined,
      longitude: number | undefined = undefined
    try {
      const geoResponse = await axios.get(
        `http://api.positionstack.com/v1/forward?&access_key=${
          appConfig.POSITIONTRACK_API_KEY
        }&query=${biolink.city + ', ' + biolink.state + ', ' + biolink.country}&limit=1&output=json`
      )

      const geoData = await geoResponse.data

      latitude = geoData.data[0].latitude || 0
      longitude = geoData.data[0].longitude || 0
    } catch (err) {
      console.log("API Error, couldn't get latitudes and longitudes")
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      bio: biolinkProfileInput.bio,
      category,
      city: biolinkProfileInput.city,
      country: biolinkProfileInput.country,
      displayName: biolinkProfileInput.displayName,
      state: biolinkProfileInput.state,
      latitude,
      longitude,
    })

    return biolink
  }

  async updateBiolinkTheme(
    biolinkId: string,
    darkModeInput: DarkModeInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(user.planId, 'darkModeEnabled')) &&
      darkModeInput.enableDarkMode
    ) {
      throw new ApolloError(
        "Dark mode isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        enableDarkMode: !!darkModeInput.enableDarkMode,
      },
    })

    return biolink
  }

  async updateDonationLink(
    biolinkId: string,
    donationInput: DonationInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'donationLinkEnabled'
      )) &&
      ((donationInput.payoneerLink || '').trim().length > 0 ||
        (donationInput.paypalLink || '').trim().length > 0 ||
        (donationInput.venmoLink || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Donation link isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        payoneerLink: donationInput.payoneerLink,
        paypalLink: donationInput.paypalLink,
        venmoLink: donationInput.venmoLink,
      },
    })

    return biolink
  }

  async updateContactButtons(
    biolinkId: string,
    contactInput: ContactButtonInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      contactInput.enableColoredContactButtons
    ) {
      throw new ApolloError(
        "Donation link isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        email: contactInput.email,
        enableColoredContactButtons: contactInput.enableColoredContactButtons,
        phone: contactInput.phone,
        showEmail: contactInput.showEmail,
        showPhone: contactInput.showPhone,
      },
    })

    return biolink
  }

  async updateSocialIconSettings(
    biolinkId: string,
    socialAccountsInput: SocialAccountsInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'coloredLinksEnabled'
      )) &&
      socialAccountsInput.enableColoredSocialMediaIcons
    ) {
      throw new ApolloError(
        "Colored link isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        enableColoredSocialMediaIcons: socialAccountsInput.enableColoredSocialMediaIcons,
        socialAccountStyleType: socialAccountsInput.socialAccountStyleType,
      },
    })

    return biolink
  }

  async updateUTMParameter(
    biolinkId: string,
    utmParameterInput: UTMParameterInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'utmParametersEnabled'
      )) &&
      (utmParameterInput.enableUtmParameters ||
        (utmParameterInput.utmCampaign || '').trim().length > 0 ||
        (utmParameterInput.utmMedium || '').trim().length > 0 ||
        (utmParameterInput.utmSource || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "UTM Parameter isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        enableUtmParameters: utmParameterInput.enableUtmParameters,
        utmCampaign: utmParameterInput.utmCampaign,
        utmMedium: utmParameterInput.utmMedium,
        utmSource: utmParameterInput.utmSource,
      },
    })

    return biolink
  }

  async uploadProfilePhoto(
    biolinkId: string,
    profilePhoto: FileUpload,
    context: MyContext
  ): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    console.log(profilePhoto)

    // TODO: Upload photo in aws s3

    return biolink
  }

  async uploadCoverPhoto(
    biolinkId: string,
    coverPhoto: FileUpload,
    context: MyContext
  ): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    console.log(coverPhoto)

    // TODO: Upload photo in aws s3

    return biolink
  }

  async updateIntegrationSettings(
    biolinkId: string,
    integrationInput: IntegrationInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'facebookPixelEnabled'
      )) &&
      (integrationInput.enableFacebookPixel ||
        (integrationInput.facebookPixelId || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Facebook pixel isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'emailCaptureEnabled'
      )) &&
      (integrationInput.enableEmailCapture ||
        (integrationInput.emailCaptureId || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Email capture isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'googleAnalyticsEnabled'
      )) &&
      (integrationInput.enableGoogleAnalytics ||
        (integrationInput.googleAnalyticsCode || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Google analytics isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        emailCaptureId: integrationInput.emailCaptureId,
        enableEmailCapture: integrationInput.enableEmailCapture,
        enableFacebookPixel: integrationInput.enableFacebookPixel,
        enableGoogleAnalytics: integrationInput.enableGoogleAnalytics,
        facebookPixelId: integrationInput.facebookPixelId,
        googleAnalyticsCode: integrationInput.googleAnalyticsCode,
      },
    })

    return biolink
  }

  async updatePrivacySettings(
    biolinkId: string,
    privacyInput: PrivacyInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'passwordProtectionEnabled'
      )) &&
      (privacyInput.enablePasswordProtection || (privacyInput.password || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Enabling password protection isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'sensitiveContentWarningEnabled'
      )) &&
      privacyInput.enableSensitiveContentWarning
    ) {
      throw new ApolloError(
        "Sensitive content warning isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        enablePasswordProtection: privacyInput.enablePasswordProtection,
        enableSensitiveContentWarning: privacyInput.enableSensitiveContentWarning,
        password: privacyInput.password && (await argon2.hash(privacyInput.password)),
      },
    })

    return biolink
  }

  async updateSEOSettings(
    biolinkId: string,
    seoInput: SEOInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(user.planId, 'seoEnabled')) &&
      (seoInput.blockSearchEngineIndexing ||
        (seoInput.metaDescription || '').trim().length > 0 ||
        (seoInput.opengraphImageUrl || '').trim().length > 0 ||
        (seoInput.pageTitle || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Enabling SEO isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        blockSearchEngineIndexing: seoInput.blockSearchEngineIndexing,
        metaDescription: seoInput.metaDescription,
        opengraphImageUrl: seoInput.opengraphImageUrl, // TODO later: Upload photo in aws s3
        pageTitle: seoInput.pageTitle,
      },
    })

    return biolink
  }

  async updateBrandSettings(
    biolinkId: string,
    brandingInput: BrandingInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'removableBrandingEnabled'
      )) &&
      brandingInput.removeDefaultBranding
    ) {
      throw new ApolloError(
        "Removing default branding isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'customFooterBrandingEnabled'
      )) &&
      ((brandingInput.customBrandingName || '').trim().length > 0 ||
        (brandingInput.customBrandingUrl || '').trim().length > 0 ||
        brandingInput.enableCustomBranding)
    ) {
      throw new ApolloError(
        "Enabling custom brands isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        customBrandingName: brandingInput.customBrandingName,
        customBrandingUrl: brandingInput.customBrandingUrl,
        enableCustomBranding: brandingInput.enableCustomBranding,
        removeDefaultBranding: brandingInput.removeDefaultBranding,
      },
    })

    return biolink
  }

  async updateDirectorySettings(
    biolinkId: string,
    directoryInput: DirectoryInput,
    context: MyContext
  ): Promise<Biolink> {
    let biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        user.planId,
        'addedToDirectoryEnabled'
      )) &&
      (directoryInput.addedToDirectory || (directoryInput.directoryBio || '').trim().length > 0)
    ) {
      throw new ApolloError(
        "Adding to the directory isn't supported in the current plan",
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    biolink = await this.biolinkService.updateBiolinkById(biolink.id, {
      settings: {
        addedToDirectory: directoryInput.addedToDirectory,
        directoryBio: directoryInput.directoryBio,
      },
    })

    return biolink
  }
}
