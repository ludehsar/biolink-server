import { FileUpload } from 'graphql-upload'
import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'
import axios from 'axios'

import {
  BiolinkAdminInput,
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
  SortedLinksInput,
  UpdateBiolinkProfileInput,
  UTMParameterInput,
} from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { Biolink, User } from '../entities'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { BlacklistType, SocialAccountStyleType } from '../enums'
import { BlackListService } from '../services/blacklist.service'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'
import { CategoryService } from '../services/category.service'
import { appConfig } from '../config'
import { PlanService } from '../services/plan.service'
import { DirectorySearchResponse } from '../object-types'
import { TrackingService } from '../services/tracking.service'
import { linktreeImportHandler } from '../utilities'
import { LinkController } from '../controllers'
import { LinkService } from '../services/link.service'
import { UserService } from '../services/user.service'

@Service()
export class BiolinkController {
  constructor(
    private readonly biolinkService: BiolinkService,
    private readonly userService: UserService,
    private readonly blacklistService: BlackListService,
    private readonly categoryService: CategoryService,
    private readonly planService: PlanService,
    private readonly trackingService: TrackingService,
    private readonly usernameService: UsernameService,
    private readonly linkController: LinkController,
    private readonly linkService: LinkService
  ) {}

  async getAllBiolinks(options: ConnectionArgs): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkService.getAllBiolinks(options)
  }

  async getBiolinkByAdmins(biolinkId: string): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    return biolink
  }

  async deleteBiolinkByAdmins(biolinkId: string): Promise<Biolink> {
    const biolink = await this.biolinkService.softDeleteBiolinkById(biolinkId)

    return biolink
  }

  async createBiolinkByAdmins(input: BiolinkAdminInput): Promise<Biolink> {
    let category = undefined
    if (input.categoryId) {
      category = await this.categoryService.getCategoryByCategoryId(input.categoryId)
    }

    let user = undefined
    if (input.userId) {
      user = await this.userService.getUserById(input.userId)
    }

    let usernameDoc = undefined
    if (input.username) {
      usernameDoc = await this.usernameService.findAvailableOneOrCreate(input.username)
    }

    const biolink = await this.biolinkService.createBiolink({
      bio: input.bio,
      category,
      changedUsername: input.changedUsername,
      city: input.city,
      country: input.country,
      coverPhoto: input.coverPhoto,
      displayName: input.displayName,
      featured: input.featured,
      latitude: input.latitude,
      longitude: input.longitude,
      profilePhoto: input.profilePhoto,
      settings: {
        addedToDirectory: input.addedToDirectory,
        blockSearchEngineIndexing: input.blockSearchEngineIndexing,
        customBrandingName: input.customBrandingName,
        customBrandingUrl: input.customBrandingUrl,
        directoryBio: input.directoryBio,
        email: input.email,
        emailCaptureId: input.emailCaptureId,
        enableColoredContactButtons: input.enableColoredContactButtons,
        enableColoredSocialMediaIcons: input.enableColoredSocialMediaIcons,
        enableCustomBranding: input.enableCustomBranding,
        enableDarkMode: input.enableDarkMode,
        enableEmailCapture: input.enableEmailCapture,
        enableFacebookPixel: input.enableFacebookPixel,
        enableGoogleAnalytics: input.enableGoogleAnalytics,
        enablePasswordProtection: input.enablePasswordProtection,
        enableSensitiveContentWarning: input.enableSensitiveContentWarning,
        enableUtmParameters: input.enableUtmParameters,
        facebookPixelId: input.facebookPixelId,
        googleAnalyticsCode: input.googleAnalyticsCode,
        metaDescription: input.metaDescription,
        opengraphImageUrl: input.opengraphImageUrl,
        pageTitle: input.pageTitle,
        password: input.password,
        payoneerLink: input.payoneerLink,
        paypalLink: input.paypalLink,
        phone: input.phone,
        removeDefaultBranding: input.removeDefaultBranding,
        showEmail: input.showEmail,
        showPhone: input.showPhone,
        socialAccountStyleType: input.socialAccountStyleType,
        utmCampaign: input.utmCampaign,
        utmMedium: input.utmMedium,
        utmSource: input.utmSource,
        venmoLink: input.venmoLink,
      },
      state: input.state,
      user,
      username: usernameDoc,
      verificationStatus: input.verificationStatus,
      verifiedEmail: input.verifiedEmail,
      verifiedGovernmentId: input.verifiedGovernmentId,
      verifiedPhoneNumber: input.verifiedPhoneNumber,
      verifiedWorkEmail: input.verifiedWorkEmail,
    })

    return biolink
  }

  async updateBiolinkByAdmins(biolinkId: string, input: BiolinkAdminInput): Promise<Biolink> {
    let category = undefined
    if (input.categoryId) {
      category = await this.categoryService.getCategoryByCategoryId(input.categoryId)
    }

    let user = undefined
    if (input.userId) {
      user = await this.userService.getUserById(input.userId)
    }

    let usernameDoc = undefined
    if (input.username) {
      usernameDoc = await this.usernameService.findAvailableOneOrCreate(input.username)
    }

    const biolink = await this.biolinkService.updateBiolinkById(biolinkId, {
      bio: input.bio,
      category,
      changedUsername: input.changedUsername,
      city: input.city,
      country: input.country,
      coverPhoto: input.coverPhoto,
      displayName: input.displayName,
      featured: input.featured,
      latitude: input.latitude,
      longitude: input.longitude,
      profilePhoto: input.profilePhoto,
      settings: {
        addedToDirectory: input.addedToDirectory,
        blockSearchEngineIndexing: input.blockSearchEngineIndexing,
        customBrandingName: input.customBrandingName,
        customBrandingUrl: input.customBrandingUrl,
        directoryBio: input.directoryBio,
        email: input.email,
        emailCaptureId: input.emailCaptureId,
        enableColoredContactButtons: input.enableColoredContactButtons,
        enableColoredSocialMediaIcons: input.enableColoredSocialMediaIcons,
        enableCustomBranding: input.enableCustomBranding,
        enableDarkMode: input.enableDarkMode,
        enableEmailCapture: input.enableEmailCapture,
        enableFacebookPixel: input.enableFacebookPixel,
        enableGoogleAnalytics: input.enableGoogleAnalytics,
        enablePasswordProtection: input.enablePasswordProtection,
        enableSensitiveContentWarning: input.enableSensitiveContentWarning,
        enableUtmParameters: input.enableUtmParameters,
        facebookPixelId: input.facebookPixelId,
        googleAnalyticsCode: input.googleAnalyticsCode,
        metaDescription: input.metaDescription,
        opengraphImageUrl: input.opengraphImageUrl,
        pageTitle: input.pageTitle,
        password: input.password,
        payoneerLink: input.payoneerLink,
        paypalLink: input.paypalLink,
        phone: input.phone,
        removeDefaultBranding: input.removeDefaultBranding,
        showEmail: input.showEmail,
        showPhone: input.showPhone,
        socialAccountStyleType: input.socialAccountStyleType,
        utmCampaign: input.utmCampaign,
        utmMedium: input.utmMedium,
        utmSource: input.utmSource,
        venmoLink: input.venmoLink,
      },
      state: input.state,
      user,
      username: usernameDoc,
      verificationStatus: input.verificationStatus,
      verifiedEmail: input.verifiedEmail,
      verifiedGovernmentId: input.verifiedGovernmentId,
      verifiedPhoneNumber: input.verifiedPhoneNumber,
      verifiedWorkEmail: input.verifiedWorkEmail,
    })

    return biolink
  }

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
      settings: {
        addedToDirectory: false,
        blockSearchEngineIndexing: false,
        customBrandingName: '',
        customBrandingUrl: '',
        directoryBio: '',
        email: '',
        emailCaptureId: '',
        enableColoredContactButtons: false,
        enableColoredSocialMediaIcons: false,
        enableCustomBranding: false,
        enableDarkMode: false,
        enableEmailCapture: false,
        enableFacebookPixel: false,
        enableGoogleAnalytics: false,
        enablePasswordProtection: false,
        enableSensitiveContentWarning: false,
        enableUtmParameters: false,
        facebookPixelId: '',
        googleAnalyticsCode: '',
        metaDescription: '',
        opengraphImageUrl: '',
        pageTitle: '',
        password: '',
        payoneerLink: '',
        paypalLink: '',
        phone: '',
        removeDefaultBranding: false,
        showEmail: false,
        showPhone: false,
        socialAccountStyleType: SocialAccountStyleType.Round,
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
      },
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
    categoryIds: string[]
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkService.getAllDirectories(options, undefined, categoryIds)
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
        enableDarkMode: darkModeInput.enableDarkMode,
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
        password: privacyInput.password,
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

  async sortLinksByBiolinkId(
    biolinkId: string,
    sortedLinkIds: SortedLinksInput,
    context: MyContext
  ): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    let counter = 1

    sortedLinkIds.linkIds?.forEach(async (linkId) => {
      const link = await this.linkService.getLinkById(linkId)

      if (link.userId !== user.id) {
        throw new ForbiddenError('Forbidden')
      }

      await this.linkService.updateLinkById(linkId, {
        order: counter,
      })

      counter++
    })

    return biolink
  }

  async importFromLinkTree(
    biolinkId: string,
    linktreeUsername: string,
    context: MyContext
  ): Promise<Biolink> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    const user = context.user as User

    if (biolink.userId !== user.id) {
      throw new ForbiddenError('Forbidden')
    }

    const url = `https://linktr.ee/${linktreeUsername}`

    try {
      const res = await linktreeImportHandler(url)

      if (res.bio) biolink.bio = res.bio

      if (res.links) {
        res.links.forEach(async (link) => {
          await this.linkController.createNewLink(
            {
              biolinkId: biolink.id,
              url: link.url,
              linkTitle: link.linkTitle,
              enablePasswordProtection: false,
            },
            context
          )
        })
      }

      if (res.socials) {
        res.socials.forEach(async (link) => {
          await this.linkController.createNewSocialLink(
            {
              biolinkId: biolink.id,
              url: link.url,
              platform: link.platform,
              featured: false,
              enablePasswordProtection: false,
            },
            context
          )
        })
      }

      await this.biolinkService.updateBiolinkById(biolink.id, {
        bio: res.bio,
        // profilePhoto: res.profilePhotoUrl,
        // TODO: Upload profile photo in aws s3
      })
    } catch (err) {
      throw new ApolloError('Something went wrong', ErrorCode.DATABASE_ERROR)
    }

    return biolink
  }
}
