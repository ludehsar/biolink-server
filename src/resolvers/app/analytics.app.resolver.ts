import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

import { BiolinkClicksResponse, BiolinkChartResponse, LinkClicksResponse } from '../../object-types'
import { getBiolinkClicksData, getLinkClicksData } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { MyContext } from '../../types'
import { authUser } from '../../middlewares'
import { TrackingController } from '../../controllers'

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly trackingController: TrackingController) {}

  @Query(() => BiolinkChartResponse)
  @UseMiddleware(authUser)
  async getBiolinkChartData(
    @Arg('id', { defaultValue: 'Biolink ID' }) id: string,
    @Ctx() context: MyContext
  ): Promise<BiolinkChartResponse> {
    return await this.trackingController.getBiolinkChartData(id, context)
  }

  @Query(() => LinkClicksResponse)
  @UseMiddleware(authUser)
  async getLinkClicksData(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<LinkClicksResponse> {
    return await getLinkClicksData(user, context)
  }

  @Query(() => BiolinkClicksResponse)
  @UseMiddleware(authUser)
  async getBiolinkClicksData(
    @Arg('biolinkId', { description: 'Biolink Id' }) biolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkClicksResponse> {
    return await getBiolinkClicksData(biolinkId, user, context)
  }
}
