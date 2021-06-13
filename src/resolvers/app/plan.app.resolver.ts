import { Query, Resolver } from 'type-graphql'
import { PlanListResponse } from '../../object-types'
import { getVisiblePlans } from '../../services'

@Resolver()
export class PlanResolver {
  @Query(() => PlanListResponse)
  async getAllPlans(): Promise<PlanListResponse> {
    return await getVisiblePlans()
  }
}
