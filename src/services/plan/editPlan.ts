import { validate } from 'class-validator'
import { PlanResponse } from '../../object-types'
import { PlanInput } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { Plan, User } from '../../entities'
import { captureUserActivity } from '../../services'
import { PlanSettings } from '../../json-types'
import { EnabledStatus } from '../../enums'

export const editPlan = async (
  id: number,
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
    (!adminRole || !userSettings || !userSettings.canEdit) &&
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

  const plan = await Plan.findOne(id)

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not found',
        },
      ],
    }
  }

  const otherPlan = await Plan.findOne({ where: { name: options.name } })

  if (otherPlan && otherPlan.id !== plan.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_ALREADY_EXISTS,
          message: 'Plan already exists',
        },
      ],
    }
  }

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
  }

  plan.annualPrice = options.annualPrice as number
  plan.annualPriceStripeId = options.annualPriceStripeId as string
  plan.enabledStatus = EnabledStatus.Enabled
  plan.monthlyPrice = options.monthlyPrice as number
  plan.monthlyPriceStripeId = options.monthlyPriceStripeId as string
  plan.name = options.name as string
  plan.settings = planSettings
  plan.visibilityStatus = options.visibilityStatus as boolean

  await plan.save()

  await captureUserActivity(adminUser, context, `Edited plan ${plan.name}`)

  return { plan }
}
