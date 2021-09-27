import { validate } from 'class-validator'
import { PlanResponse } from '../../object-types'
import { PlanInput } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { Plan, User } from '../../entities'
import { captureUserActivity } from '../../services'
import { PlanSettings } from '../../json-types'
import { EnabledStatus } from '../../enums'

export const createPlan = async (
  options: PlanInput,
  adminUser: User,
  context: MyContext
): Promise<PlanResponse> => {
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
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'plan'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canCreate) &&
    adminRole.roleName !== 'Administrator'
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  try {
    const planSettings: PlanSettings = {
      addedToDirectoryEnabled: options.addedToDirectoryEnabled || false,
      coloredLinksEnabled: options.coloredLinksEnabled || false,
      customBackHalfEnabled: options.customBackHalfEnabled || false,
      customFooterBrandingEnabled: options.customFooterBrandingEnabled || false,
      darkModeEnabled: options.darkModeEnabled || false,
      emailCaptureEnabled: options.emailCaptureEnabled || false,
      facebookPixelEnabled: options.facebookPixelEnabled || false,
      googleAnalyticsEnabled: options.googleAnalyticsEnabled || false,
      leapLinkEnabled: options.leapLinkEnabled || false,
      linksSchedulingEnabled: options.linksSchedulingEnabled || false,
      noAdsEnabled: options.noAdsEnabled || false,
      passwordProtectionEnabled: options.passwordProtectionEnabled || false,
      removableBrandingEnabled: options.removableBrandingEnabled || false,
      sensitiveContentWarningEnabled: options.sensitiveContentWarningEnabled || false,
      seoEnabled: options.seoEnabled || false,
      socialEnabled: options.socialEnabled || false,
      totalBiolinksLimit: options.totalBiolinksLimit || 0,
      totalCustomDomainLimit: options.totalCustomDomainLimit || 0,
      totalLinksLimit: options.totalLinksLimit || 0,
      utmParametersEnabled: options.utmParametersEnabled || false,
      verifiedCheckmarkEnabled: options.verifiedCheckmarkEnabled || false,
      donationLinkEnabled: options.donationLinkEnabled || false,
    }
    const plan = await Plan.create({
      annualPrice: options.annualPrice,
      annualPriceStripeId: options.annualPriceStripeId,
      enabledStatus: EnabledStatus.Enabled,
      monthlyPrice: options.monthlyPrice,
      monthlyPriceStripeId: options.monthlyPriceStripeId,
      name: options.name,
      settings: planSettings,
      visibilityStatus: options.visibilityStatus,
    }).save()

    await captureUserActivity(adminUser, context, `Created plan ${plan.name}`, true)

    return { plan }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_ALREADY_EXISTS,
          message: 'Something went wrong',
        },
      ],
    }
  }
}
