import { Query, Resolver } from 'type-graphql'

import { PlanController } from '../../controllers'
import { Plan } from '../../entities'

@Resolver()
export class PlanResolver {
  constructor(private readonly planController: PlanController) {}
  @Query(() => [Plan])
  async getAllPlans(): Promise<Plan[]> {
    return await this.planController.getAllVisiblePlans()
  }
}
