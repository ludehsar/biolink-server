import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

import { BiolinkClicksResponse, LinkClicksResponse } from '../../object-types'
import { MyContext } from '../../types'
import { authUser } from '../../middlewares'
import { TrackingController } from '../../controllers'
import { ConnectionArgs } from '../../input-types'
import { DailyClickChartResponse } from '../../object-types/common/DailyClickChartResponse'

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly trackingController: TrackingController) {}

  @Query(() => DailyClickChartResponse)
  @UseMiddleware(authUser)
  async getBiolinkChartData(
    @Arg('id', { defaultValue: 'Biolink ID' }) id: string,
    @Ctx() context: MyContext
  ): Promise<DailyClickChartResponse> {
    return await this.trackingController.getBiolinkChartData(id, context)
  }

  @Query(() => LinkClicksResponse)
  @UseMiddleware(authUser)
  async getLinkClicksData(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<LinkClicksResponse> {
    return await this.trackingController.getLinkClicksData(options, context)
  }

  @Query(() => BiolinkClicksResponse)
  @UseMiddleware(authUser)
  async getBiolinkClicksData(
    @Arg('biolinkId', { description: 'Biolink Id' }) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<BiolinkClicksResponse> {
    return await this.trackingController.getBiolinkClicksData(biolinkId, context)
  }
}
