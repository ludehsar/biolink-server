import { Service } from 'typedi'

import { Plan } from '../entities'
import { PlanService } from '../services/plan.service'
import { ConnectionArgs, PlanInput } from '../input-types'
import { PaginatedPlanResponse } from '../object-types/common/PaginatedPlanResponse'

@Service()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  async getAllVisiblePlans(): Promise<Plan[]> {
    return await this.planService.getAllVisiblePlans()
  }

  async getAllPlans(options: ConnectionArgs): Promise<PaginatedPlanResponse> {
    return await this.planService.getAllPlans(options)
  }

  async getPlan(planId: string): Promise<Plan> {
    return await this.planService.getPlanByPlanId(planId)
  }

  async createPlan(input: PlanInput): Promise<Plan> {
    return await this.planService.createPlan({
      annualPrice: input.annualPrice,
      annualPriceStripeId: input.annualPriceStripeId,
      enabledStatus: input.enabledStatus,
      monthlyPrice: input.monthlyPrice,
      monthlyPriceStripeId: input.monthlyPriceStripeId,
      name: input.name,
      settings: {
        addedToDirectoryEnabled: input.addedToDirectoryEnabled,
        coloredLinksEnabled: input.coloredLinksEnabled,
        customBackHalfEnabled: input.customBackHalfEnabled,
        customFooterBrandingEnabled: input.customFooterBrandingEnabled,
        darkModeEnabled: input.darkModeEnabled,
        donationLinkEnabled: input.donationLinkEnabled,
        emailCaptureEnabled: input.emailCaptureEnabled,
        facebookPixelEnabled: input.facebookPixelEnabled,
        googleAnalyticsEnabled: input.googleAnalyticsEnabled,
        leapLinkEnabled: input.leapLinkEnabled,
        linksSchedulingEnabled: input.linksSchedulingEnabled,
        noAdsEnabled: input.noAdsEnabled,
        passwordProtectionEnabled: input.passwordProtectionEnabled,
        removableBrandingEnabled: input.removableBrandingEnabled,
        sensitiveContentWarningEnabled: input.sensitiveContentWarningEnabled,
        seoEnabled: input.seoEnabled,
        socialEnabled: input.socialEnabled,
        totalBiolinksLimit: input.totalBiolinksLimit,
        totalCustomDomainLimit: input.totalCustomDomainLimit,
        totalLinksLimit: input.totalLinksLimit,
        utmParametersEnabled: input.utmParametersEnabled,
        verifiedCheckmarkEnabled: input.verifiedCheckmarkEnabled,
      },
      visibilityStatus: input.visibilityStatus,
    })
  }

  async updatePlan(planId: string, input: PlanInput): Promise<Plan> {
    return await this.planService.updatePlanByPlanId(planId, {
      annualPrice: input.annualPrice,
      annualPriceStripeId: input.annualPriceStripeId,
      enabledStatus: input.enabledStatus,
      monthlyPrice: input.monthlyPrice,
      monthlyPriceStripeId: input.monthlyPriceStripeId,
      name: input.name,
      settings: {
        addedToDirectoryEnabled: input.addedToDirectoryEnabled,
        coloredLinksEnabled: input.coloredLinksEnabled,
        customBackHalfEnabled: input.customBackHalfEnabled,
        customFooterBrandingEnabled: input.customFooterBrandingEnabled,
        darkModeEnabled: input.darkModeEnabled,
        donationLinkEnabled: input.donationLinkEnabled,
        emailCaptureEnabled: input.emailCaptureEnabled,
        facebookPixelEnabled: input.facebookPixelEnabled,
        googleAnalyticsEnabled: input.googleAnalyticsEnabled,
        leapLinkEnabled: input.leapLinkEnabled,
        linksSchedulingEnabled: input.linksSchedulingEnabled,
        noAdsEnabled: input.noAdsEnabled,
        passwordProtectionEnabled: input.passwordProtectionEnabled,
        removableBrandingEnabled: input.removableBrandingEnabled,
        sensitiveContentWarningEnabled: input.sensitiveContentWarningEnabled,
        seoEnabled: input.seoEnabled,
        socialEnabled: input.socialEnabled,
        totalBiolinksLimit: input.totalBiolinksLimit,
        totalCustomDomainLimit: input.totalCustomDomainLimit,
        totalLinksLimit: input.totalLinksLimit,
        utmParametersEnabled: input.utmParametersEnabled,
        verifiedCheckmarkEnabled: input.verifiedCheckmarkEnabled,
      },
      visibilityStatus: input.visibilityStatus,
    })
  }

  async deletePlan(planId: string): Promise<Plan> {
    return await this.planService.softDeletePlanByPlanId(planId)
  }
}
