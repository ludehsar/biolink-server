import { PlanResponse } from 'object-types'
import { getAllPlans } from 'services'
import { Query, Resolver } from 'type-graphql'

@Resolver()
export class PlanResolver {
  @Query(() => PlanResponse)
  async getAllPlans(): Promise<PlanResponse> {
    return await getAllPlans()
  }
}
