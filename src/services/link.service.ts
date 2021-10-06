import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { TrackLink } from '../entities'
import { DailyClickChartResponse } from '../object-types/common/DailyClickChartResponse'

@Service()
export class LinkService {
  constructor(
    @InjectRepository(TrackLink) private readonly tracklinkRepository: Repository<TrackLink>
  ) {}

  /**
   * Gets biolink daily clicks chart
   * @param {string} biolinkId
   * @returns {Promise<DailyClickChartResponse>}
   */
  async getBiolinkDailyClickChartsByBiolinkId(biolinkId: string): Promise<DailyClickChartResponse> {
    const result = await this.tracklinkRepository.query(
      `
        SELECT date, coalesce(views, 0) as views
        FROM  (
          SELECT "date"::date
          FROM generate_series(current_date - interval '7 days'
                            ,  current_date
                            ,  interval  '1 day') "date"
          ) d
        LEFT JOIN (
          SELECT "tb"."createdAt"::date AS date
                , count(*) AS views
          FROM   "track_link" "tb"
          WHERE  "tb"."createdAt" >= current_date - interval '7 days'
          AND    "tb"."biolinkId" = '${biolinkId}'
          GROUP  BY 1
          ) t USING (date)
        ORDER  BY date;
      `
    )

    return {
      result,
    }
  }
}
