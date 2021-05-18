import { Arg, Mutation, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { getBiolinkTrackingsByBiolinkUsername } from '../../controllers/analytics.controller'
import { AnalyticsInput, AnalyticsResponse } from '../../typeDefs/analytics.typeDef'

@Resolver()
export class AnalyticsResolver {
  @Mutation(() => AnalyticsResponse)
  async getBiolinkAnalyticsByUsername(
    @Arg('options') options: AnalyticsInput,
    @CurrentUser() user: User
  ): Promise<AnalyticsResponse> {
    return await getBiolinkTrackingsByBiolinkUsername(
      options.username,
      user,
      options.startDate,
      options.endDate
    )
  }
}
