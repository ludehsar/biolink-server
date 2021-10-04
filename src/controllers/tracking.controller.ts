import { ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { MyContext } from '../types'
import { User } from '../entities'
import { TrackingService } from '../services/tracking.service'
import { DailyClickChartResponse } from '../object-types/common/DailyClickChartResponse'
import { BiolinkService } from '../services/biolink.service'

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

    return this.trackingService.getBiolinkDailyClickChartsByBiolinkId(biolinkId)
  }
}
