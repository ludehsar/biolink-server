import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { PlanListResponse, PlanResponse } from '../../object-types'
import { createPlan, editPlan, getAllPlans, getPlan } from '../../services'
import { PlanInput } from '../../input-types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { MyContext } from 'types'

@Resolver()
export class PlanAdminResolver {
  @Query(() => PlanListResponse)
  async getAllPlans(
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PlanListResponse> {
    return await getAllPlans(adminUser, context)
  }

  @Query(() => PlanResponse)
  async getPlan(
    @Arg('id', () => Int) id: number,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PlanResponse> {
    return await getPlan(id, adminUser, context)
  }

  @Mutation(() => PlanResponse)
  async createPlan(
    @Arg('options') options: PlanInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PlanResponse> {
    return await createPlan(options, adminUser, context)
  }

  @Mutation(() => PlanResponse)
  async editPlan(
    @Arg('id', () => Int) id: number,
    @Arg('options') options: PlanInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PlanResponse> {
    return await editPlan(id, options, adminUser, context)
  }
}
