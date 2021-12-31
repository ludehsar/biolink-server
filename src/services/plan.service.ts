import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-errors'

import { Plan } from '../entities'
import { ErrorCode } from '../types'
import { PlanSettings } from '../json-types'
import { UserService } from './user.service'
import { PlanType } from '../enums'
import { PaginatedPlanResponse } from '../object-types/common/PaginatedPlanResponse'
import { ConnectionArgs } from '../input-types'
import { PlanUpdateBody } from '../interfaces/PlanUpdateBody'

@Service()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    private readonly userService: UserService
  ) {}

  /**
   * Get free plan
   * @returns {Promise<Plan>}
   */
  async getFreePlan(): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: {
        name: 'Free',
      },
    })

    if (!plan) {
      throw new ApolloError(
        'Currently free plan is not available',
        ErrorCode.PLAN_COULD_NOT_BE_FOUND
      )
    }

    return plan
  }

  /**
   * Get plan by plan id
   * @param {string} planId
   * @returns {Promise<Plan>}
   */
  async getPlanByPlanId(planId: string): Promise<Plan> {
    const plan = await this.planRepository.findOne(planId)

    if (!plan) {
      throw new ApolloError('plan is not available', ErrorCode.PLAN_COULD_NOT_BE_FOUND)
    }

    return plan
  }

  /**
   * Get free plan
   * @param {string} stripePriceId
   * @returns {Promise<Plan>}
   */
  async getPlanByStripePriceId(stripePriceId: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: [{ monthlyPriceStripeId: stripePriceId }, { annualPriceStripeId: stripePriceId }],
    })

    if (!plan) {
      throw new ApolloError('Plan not found', ErrorCode.PLAN_COULD_NOT_BE_FOUND)
    }

    return plan
  }

  /**
   * Get values from plan settings
   * @param {string} planId
   * @param {keyof PlanSettings} keyword
   * @returns {Promise<boolean | number | undefined>}
   */
  async getValuesFromPlanSettingsByPlanId(
    planId: string,
    keyword: keyof PlanSettings
  ): Promise<boolean | number | undefined> {
    const plan = await this.getPlanByPlanId(planId)

    const planSettings = plan.settings || {}

    return planSettings[keyword]
  }

  /**
   * Get all visible plans
   * @returns {Promise<Plan[]>}
   */
  async getAllVisiblePlans(): Promise<Plan[]> {
    const plan = await this.planRepository.find({
      where: {
        visibilityStatus: true,
      },
    })

    return plan
  }

  /**
   * Get all plans
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedPlanResponse>}
   */
  async getAllPlans(options: ConnectionArgs): Promise<PaginatedPlanResponse> {
    const queryBuilder = this.planRepository.createQueryBuilder('plan')

    const paginator = buildPaginator({
      entity: Plan,
      alias: 'plan',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Subscribe plan
   * @param {string} planId
   * @param {keyof PlanSettings} keyword
   * @returns {Promise<void>}
   */
  async subscribePlanByUserId(
    stripePriceId: string,
    expirationDate: Date,
    userId: string
  ): Promise<void> {
    const plan = await this.getPlanByStripePriceId(stripePriceId)

    await this.userService.updateUserById(userId, {
      plan,
      planExpirationDate: expirationDate,
      planType: plan.monthlyPriceStripeId === stripePriceId ? PlanType.Monthly : PlanType.Annual,
    })
  }

  /**
   * Create plan
   * @param {PlanUpdateBody} updateBody
   * @returns {Promise<Plan>}
   */
  async createPlan(updateBody: PlanUpdateBody): Promise<Plan> {
    let plan = await this.planRepository.create().save()

    plan = await this.updatePlanByPlanId(plan.id, updateBody)

    return plan
  }

  /**
   * Update plan by id
   * @param {string} planId
   * @param {PlanUpdateBody} updateBody
   * @returns {Promise<Plan>}
   */
  async updatePlanByPlanId(planId: string, updateBody: PlanUpdateBody): Promise<Plan> {
    const plan = await this.getPlanByPlanId(planId)

    if (updateBody.annualPrice !== undefined) plan.annualPrice = updateBody.annualPrice
    if (updateBody.annualPriceStripeId !== undefined)
      plan.annualPriceStripeId = updateBody.annualPriceStripeId
    if (updateBody.enabledStatus !== undefined) plan.enabledStatus = updateBody.enabledStatus
    if (updateBody.monthlyPrice !== undefined) plan.monthlyPrice = updateBody.monthlyPrice
    if (updateBody.monthlyPriceStripeId !== undefined)
      plan.monthlyPriceStripeId = updateBody.monthlyPriceStripeId
    if (updateBody.name !== undefined) plan.name = updateBody.name
    if (updateBody.settings !== undefined) {
      const settings = plan.settings || {}
      if (updateBody.settings.addedToDirectoryEnabled !== undefined)
        settings.addedToDirectoryEnabled = updateBody.settings.addedToDirectoryEnabled
      if (updateBody.settings.coloredLinksEnabled !== undefined)
        settings.coloredLinksEnabled = updateBody.settings.coloredLinksEnabled
      if (updateBody.settings.customBackHalfEnabled !== undefined)
        settings.customBackHalfEnabled = updateBody.settings.customBackHalfEnabled
      if (updateBody.settings.customFooterBrandingEnabled !== undefined)
        settings.customFooterBrandingEnabled = updateBody.settings.customFooterBrandingEnabled
      if (updateBody.settings.darkModeEnabled !== undefined)
        settings.darkModeEnabled = updateBody.settings.darkModeEnabled
      if (updateBody.settings.donationLinkEnabled !== undefined)
        settings.donationLinkEnabled = updateBody.settings.donationLinkEnabled
      if (updateBody.settings.emailCaptureEnabled !== undefined)
        settings.emailCaptureEnabled = updateBody.settings.emailCaptureEnabled
      if (updateBody.settings.facebookPixelEnabled !== undefined)
        settings.facebookPixelEnabled = updateBody.settings.facebookPixelEnabled
      if (updateBody.settings.googleAnalyticsEnabled !== undefined)
        settings.googleAnalyticsEnabled = updateBody.settings.googleAnalyticsEnabled
      if (updateBody.settings.leapLinkEnabled !== undefined)
        settings.leapLinkEnabled = updateBody.settings.leapLinkEnabled
      if (updateBody.settings.linksSchedulingEnabled !== undefined)
        settings.linksSchedulingEnabled = updateBody.settings.linksSchedulingEnabled
      if (updateBody.settings.noAdsEnabled !== undefined)
        settings.noAdsEnabled = updateBody.settings.noAdsEnabled
      if (updateBody.settings.passwordProtectionEnabled !== undefined)
        settings.passwordProtectionEnabled = updateBody.settings.passwordProtectionEnabled
      if (updateBody.settings.removableBrandingEnabled !== undefined)
        settings.removableBrandingEnabled = updateBody.settings.removableBrandingEnabled
      if (updateBody.settings.sensitiveContentWarningEnabled !== undefined)
        settings.sensitiveContentWarningEnabled = updateBody.settings.sensitiveContentWarningEnabled
      if (updateBody.settings.seoEnabled !== undefined)
        settings.seoEnabled = updateBody.settings.seoEnabled
      if (updateBody.settings.socialEnabled !== undefined)
        settings.socialEnabled = updateBody.settings.socialEnabled
      if (updateBody.settings.totalBiolinksLimit !== undefined)
        settings.totalBiolinksLimit = updateBody.settings.totalBiolinksLimit
      if (updateBody.settings.totalCustomDomainLimit !== undefined)
        settings.totalCustomDomainLimit = updateBody.settings.totalCustomDomainLimit
      if (updateBody.settings.totalLinksLimit !== undefined)
        settings.totalLinksLimit = updateBody.settings.totalLinksLimit
      if (updateBody.settings.utmParametersEnabled !== undefined)
        settings.utmParametersEnabled = updateBody.settings.utmParametersEnabled
      if (updateBody.settings.verifiedCheckmarkEnabled !== undefined)
        settings.verifiedCheckmarkEnabled = updateBody.settings.verifiedCheckmarkEnabled

      plan.settings = settings
    }
    if (updateBody.visibilityStatus !== undefined)
      plan.visibilityStatus = updateBody.visibilityStatus

    await plan.save()

    return plan
  }

  /**
   * Soft delete plan by id
   * @param {string} planId
   * @returns {Promise<Plan>}
   */
  async softDeletePlanByPlanId(planId: string): Promise<Plan> {
    const plan = await this.getPlanByPlanId(planId)

    await plan.softRemove()

    return plan
  }
}
