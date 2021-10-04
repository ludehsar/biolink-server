import { Service } from 'typedi'
import { Repository } from 'typeorm'
import DeviceDetector from 'device-detector-js'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as geoip from 'geoip-lite'

import { Biolink, Link, TrackLink, UserLogs } from '../entities'
import { MyContext } from '../types'
import { DailyClickChartResponse } from '../object-types/common/DailyClickChartResponse'

@Service()
export class TrackingService {
  constructor(
    @InjectRepository(UserLogs) private readonly tracklinkRepository: Repository<TrackLink>
  ) {}

  /**
   * Tracks links or biolinks
   * @param {Biolink | Link} linkOrBiolink
   * @returns {Promise<TrackLink>}
   */
  async trackVisitors(linkOrBiolink: Biolink | Link, context: MyContext): Promise<TrackLink> {
    const ip = context.req.ip
    const geo = geoip.lookup(ip)
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

    const trackingDoc = this.tracklinkRepository.create({
      browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
      browserName: device.client?.name || 'Unknown',
      cityName: geo?.city || 'Unknown',
      countryCode: geo?.country || 'Unknown',
      deviceType: device.device
        ? device.device.type.charAt(0).toUpperCase() + device.device.type.slice(1)
        : 'Unknown',
      osName: device.os?.name || 'Unknown',
      referer: context.req.headers.referer || 'Unknown',
      utmCampaign: context.req.params.utm_campaign || 'Unknown',
      utmMedium: context.req.params.utm_medium || 'Unknown',
      utmSource: context.req.params.utm_source || 'Unknown',
    })

    if (linkOrBiolink instanceof Link) trackingDoc.link = Promise.resolve(linkOrBiolink)
    else trackingDoc.biolink = Promise.resolve(linkOrBiolink)
    await trackingDoc.save()

    return trackingDoc
  }

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
