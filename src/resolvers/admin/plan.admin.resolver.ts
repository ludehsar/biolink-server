import { Query, Resolver } from 'type-graphql'
import { PlanResponse } from '../../object-types'
import { getAllPlans } from '../../services'

@Resolver()
export class PlanAdminResolver {
  @Query(() => PlanResponse)
  async getAllPlans(): Promise<PlanResponse> {
    return await getAllPlans()
  }
}
