import { Arg, Query, Resolver } from 'type-graphql'

import { ChartResponse, LinkClicksResponse } from '../../object-types'
import { getBiolinkChartData, getLinkClicksData } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'

@Resolver()
export class AnalyticsResolver {
  @Query(() => ChartResponse)
  async getBiolinkChartData(
    @Arg('id', { defaultValue: 'Biolink ID' }) id: string,
    @CurrentUser() user: User
  ): Promise<ChartResponse> {
    return await getBiolinkChartData(id, user)
  }

  @Query(() => LinkClicksResponse)
  async getLinkClicksData(@CurrentUser() user: User): Promise<LinkClicksResponse> {
    return await getLinkClicksData(user)
  }
}
