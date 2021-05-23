import { Query, Resolver } from 'type-graphql'

import { getAllPlans } from '../../controllers/app/plan.controller'
import { PlanResponse } from '../../typeDefs/plan.typeDef'

@Resolver()
export class PlanResolver {
  @Query(() => PlanResponse)
  async getAllPlans(): Promise<PlanResponse> {
    return await getAllPlans()
  }
}
