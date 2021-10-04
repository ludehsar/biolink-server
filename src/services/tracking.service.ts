import { buildPaginator } from 'typeorm-cursor-pagination'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import DeviceDetector from 'device-detector-js'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as geoip from 'geoip-lite'

import { Biolink, Link, TrackLink, UserLogs } from '../entities'
import { MyContext } from '../types'
import { DailyClickChartResponse } from '../object-types/common/DailyClickChartResponse'
import { ConnectionArgs } from '../input-types'
import {
  BiolinkClicksResponse,
  LinkClicksResponse,
  SingleBiolinkClickCount,
  SingleLinkClickCount,
} from '../object-types'

@Service()
export class TrackingService {
  constructor(
    @InjectRepository(UserLogs) private readonly tracklinkRepository: Repository<TrackLink>,
    @InjectRepository(UserLogs) private readonly linkRepository: Repository<Link>
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

  /**
   * Gets biolink clicks count
   * @param {Biolink} biolink
   * @returns {Promise<DailyClickChartResponse>}
   */
  async getBiolinksClickCounts(biolink: Biolink): Promise<BiolinkClicksResponse> {
    const result: SingleBiolinkClickCount = {
      biolink,
      allTimeVisited: await this.tracklinkRepository
        .createQueryBuilder('tb')
        .where('tb.biolinkId = :biolinkId', { biolinkId: biolink.id })
        .getCount(),
      todayVisited: await this.tracklinkRepository
        .createQueryBuilder('tb')
        .where('tb.biolinkId = :biolinkId', { biolinkId: biolink.id })
        .andWhere('"tb"."createdAt"::date = current_date')
        .getCount(),
    }

    return {
      result,
    }
  }

  /**
   * Gets links click counts by user id
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<DailyClickChartResponse>}
   */
  async getLinksClickCountsByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<LinkClicksResponse> {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .where(`link.userId = :userId`, {
        userId: userId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(link.linkTitle) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(link.url) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(link.shortenedUrl) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(link.note) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Link,
      alias: 'link',
      paginationKeys: ['createdAt'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    const { data, cursor } = await paginator.paginate(queryBuilder)

    const result: SingleLinkClickCount[] = await Promise.all(
      data.map(
        async (link): Promise<SingleLinkClickCount> => ({
          link,
          allTimeVisited: await this.tracklinkRepository
            .createQueryBuilder('tl')
            .where('tl.linkId = :linkId', { linkId: link.id })
            .getCount(),
          todayVisited: await this.tracklinkRepository
            .createQueryBuilder('tl')
            .where('tl.linkId = :linkId', { linkId: link.id })
            .andWhere('"tl"."createdAt"::date = current_date')
            .getCount(),
        })
      )
    )

    return {
      result,
      cursor,
    }
  }
}
