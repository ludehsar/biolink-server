import { Arg, Ctx, Query, Resolver } from 'type-graphql'

import { BiolinkClicksResponse, ChartResponse, LinkClicksResponse } from '../../object-types'
import { getBiolinkChartData, getBiolinkClicksData, getLinkClicksData } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { MyContext } from '../../types'

@Resolver()
export class AnalyticsResolver {
  @Query(() => ChartResponse)
  async getBiolinkChartData(
    @Arg('id', { defaultValue: 'Biolink ID' }) id: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<ChartResponse> {
    return await getBiolinkChartData(id, user, context)
  }

  @Query(() => LinkClicksResponse)
  async getLinkClicksData(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<LinkClicksResponse> {
    return await getLinkClicksData(user, context)
  }

  @Query(() => BiolinkClicksResponse)
  async getBiolinkClicksData(
    @Arg('biolinkId', { description: 'Biolink Id' }) biolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkClicksResponse> {
    return await getBiolinkClicksData(biolinkId, user, context)
  }
}
