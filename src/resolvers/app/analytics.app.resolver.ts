import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

import { BiolinkClicksResponse, BiolinkChartResponse, LinkClicksResponse } from '../../object-types'
import { getBiolinkChartData, getBiolinkClicksData, getLinkClicksData } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { MyContext } from '../../types'
import { emailVerified } from '../../middlewares'

@Resolver()
export class AnalyticsResolver {
  @Query(() => BiolinkChartResponse)
  @UseMiddleware(emailVerified)
  async getBiolinkChartData(
    @Arg('id', { defaultValue: 'Biolink ID' }) id: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkChartResponse> {
    return await getBiolinkChartData(id, user, context)
  }

  @Query(() => LinkClicksResponse)
  @UseMiddleware(emailVerified)
  async getLinkClicksData(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<LinkClicksResponse> {
    return await getLinkClicksData(user, context)
  }

  @Query(() => BiolinkClicksResponse)
  @UseMiddleware(emailVerified)
  async getBiolinkClicksData(
    @Arg('biolinkId', { description: 'Biolink Id' }) biolinkId: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkClicksResponse> {
    return await getBiolinkClicksData(biolinkId, user, context)
  }
}
