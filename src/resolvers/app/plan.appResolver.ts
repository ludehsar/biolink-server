import { Query, Resolver } from 'type-graphql'

import { Plan } from '../../models/entities/Plan'
import { getAllPlans } from '../../controllers/plan.controller'

@Resolver()
export class PlanResolver {
  @Query(() => [Plan] || null)
  async getAllPlans(): Promise<Plan[] | null> {
    return await getAllPlans()
  }
}
