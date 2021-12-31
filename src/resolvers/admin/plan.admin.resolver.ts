import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { ConnectionArgs, PlanInput } from '../../input-types'
import { Plan } from '../../entities'
import { PlanController } from '../../controllers'
import { PaginatedPlanResponse } from '../../object-types/common/PaginatedPlanResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class PlanAdminResolver {
  constructor(private readonly planController: PlanController) {}

  @Query(() => PaginatedPlanResponse)
  @UseMiddleware(authAdmin('plan.canShowList'))
  async getAllPlans(@Arg('options') options: ConnectionArgs): Promise<PaginatedPlanResponse> {
    return await this.planController.getAllPlans(options)
  }

  @Query(() => Plan)
  @UseMiddleware(authAdmin('plan.canShow'))
  async getPlan(@Arg('id') id: string): Promise<Plan> {
    return await this.planController.getPlan(id)
  }

  @Mutation(() => Plan)
  @UseMiddleware(authAdmin('plan.canCreate'))
  async createPlan(@Arg('options') options: PlanInput): Promise<Plan> {
    return await this.planController.createPlan(options)
  }

  @Mutation(() => Plan)
  @UseMiddleware(authAdmin('plan.canEdit'))
  async editPlan(@Arg('id') id: string, @Arg('options') options: PlanInput): Promise<Plan> {
    return await this.planController.updatePlan(id, options)
  }

  @Mutation(() => Plan)
  @UseMiddleware(authAdmin('plan.canDelete'))
  async deletePlan(@Arg('id') id: string): Promise<Plan> {
    return await this.planController.deletePlan(id)
  }
}
