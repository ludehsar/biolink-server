import { Query, Resolver } from 'type-graphql'
import { PlanResponse } from '../../object-types'
import { getAllPlans } from '../../services'

@Resolver()
export class PlanResolver {
  @Query(() => PlanResponse)
  async getAllPlans(): Promise<PlanResponse> {
    return await getAllPlans()
  }
}
