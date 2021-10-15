import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'

import { Plan } from '../entities'
import { ErrorCode } from '../types'
import { PlanSettings } from '../json-types'

@Service()
export class PlanService {
  constructor(@InjectRepository(Plan) private readonly planRepository: Repository<Plan>) {}

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
   * Get free plan
   * @param {number} planId
   * @returns {Promise<Plan>}
   */
  async getPlanByPlanId(planId: number): Promise<Plan> {
    const plan = await this.planRepository.findOne(planId)

    if (!plan) {
      throw new ApolloError('plan is not available', ErrorCode.PLAN_COULD_NOT_BE_FOUND)
    }

    return plan
  }

  /**
   * Get values from plan settings
   * @param {number} planId
   * @param {keyof PlanSettings} keyword
   * @returns {Promise<boolean | number | undefined>}
   */
  async getValuesFromPlanSettingsByPlanId(
    planId: number,
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
}
