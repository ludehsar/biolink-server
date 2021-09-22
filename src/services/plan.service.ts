import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'

import { Plan } from '../entities'
import { ErrorCode } from '../types'

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
}
