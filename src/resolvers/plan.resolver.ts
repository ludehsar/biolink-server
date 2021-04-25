import { Query, Resolver } from 'type-graphql'
import { getRepository } from 'typeorm'

import { Plan } from '../models/entities/Plan'
import { EnabledStatus } from '../models/enums/EnabledStatus'

@Resolver()
export class PlanResolver {
  @Query(() => [Plan] || null)
  async getAllPlans(): Promise<Plan[] | null> {
    const plans = await getRepository(Plan)
      .createQueryBuilder()
      .where({
        visibilityStatus: true,
        enabledStatus: EnabledStatus.Enabled,
      })
      .getMany()

    if (!plans) {
      return null
    }

    return plans
  }
}
