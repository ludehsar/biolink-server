import { Arg, Query, Resolver } from 'type-graphql'

import { ChartResponse } from '../../object-types'
import { getBiolinkChartData } from '../../services'
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
}
