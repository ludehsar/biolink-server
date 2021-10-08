import { ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { MyContext } from '../types'
import { User } from '../entities'
import { TrackingService } from '../services/tracking.service'
import { DailyClickChartResponse } from '../object-types/common/DailyClickChartResponse'
import { BiolinkService } from '../services/biolink.service'
import { ConnectionArgs } from '../input-types'
import { BiolinkClicksResponse, LinkClicksResponse } from '../object-types'

@Service()
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly biolinkService: BiolinkService
  ) {}

  async getBiolinkChartData(
    biolinkId: string,
    context: MyContext
  ): Promise<DailyClickChartResponse> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.trackingService.getBiolinkDailyClickChartsByBiolinkId(biolinkId)
  }

  async getLinkClicksData(
    connectionArgs: ConnectionArgs,
    context: MyContext
  ): Promise<LinkClicksResponse> {
    return await this.trackingService.getLinksClickCountsByUserId(
      (context.user as User).id,
      connectionArgs
    )
  }

  async getBiolinkClicksData(
    biolinkId: string,
    context: MyContext
  ): Promise<BiolinkClicksResponse> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.trackingService.getBiolinksClickCounts(biolink)
  }
}
