import { Service } from 'typedi'
import { Repository } from 'typeorm'
import DeviceDetector from 'device-detector-js'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as geoip from 'geoip-lite'
import moment from 'moment'
import axios from 'axios'
import { buildPaginator } from 'typeorm-cursor-pagination'

import { User, UserLogs } from '../entities'
import { MyContext } from '../types'
import { UserService } from './user.service'
import { CountryInfo } from '../interfaces'
import { ConnectionArgs } from '../input-types'
import { PaginatedUserLogResponse } from '../object-types'

@Service()
export class NotificationService {
  constructor(
    @InjectRepository(UserLogs) private readonly userlogsRepository: Repository<UserLogs>,
    private readonly userService: UserService
  ) {}

  /**
   * Tracks user major activities
   * @param {User} user
   * @param {MyContext} context
   * @param {string} description
   * @param {boolean} [showInActivity]
   * @returns {Promise<UserLogs>}
   */
  async createUserLogs(
    user: User,
    context: MyContext,
    description: string,
    showInActivity = false
  ): Promise<UserLogs> {
    const ip = context.req.ip
    const geo = geoip.lookup(ip)
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(context.req.headers['user-agent'] || '')

    const userLog = this.userlogsRepository.create({
      description,
      ipAddress: ip,
      browserLanguage: context.req.acceptsLanguages()[0] || 'Unknown',
      browserName: device.client?.name || 'Unknown',
      cityName: geo?.city || 'Unknown',
      countryCode: geo?.country || 'Unknown',
      deviceType: device.device
        ? device.device.type.charAt(0).toUpperCase() + device.device.type.slice(1)
        : 'Unknown',
      osName: device.os?.name || 'Unknown',
      showInActivity,
    })
    userLog.user = Promise.resolve(user)
    await userLog.save()

    let country = ''

    if (geo) {
      const countryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/' + geo.country)
      country = ((await countryInfo.data) as CountryInfo).name
    }

    await this.userService.updateUserById(user.id, {
      language: context.req.acceptsLanguages()[0] || 'Unknown',
      lastIPAddress: ip,
      lastUserAgent: context.req.headers['user-agent'] || '',
      timezone: new Date().getTimezoneOffset().toString(),
      lastActiveTill: moment(moment.now()).add(5, 'm').toDate(),
      country,
    })

    return userLog
  }

  /**
   * Get user notification
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedUserLogResponse>}
   */
  async getNotification(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedUserLogResponse> {
    const queryBuilder = this.userlogsRepository
      .createQueryBuilder('activity')
      .where(`activity.userId = :userId`, {
        userId: userId,
      })
      .andWhere(`activity.showInActivity = TRUE`)
      .andWhere(`LOWER(activity.description) like :query`, {
        query: `%${options.query.toLowerCase()}%`,
      })

    const paginator = buildPaginator({
      entity: UserLogs,
      alias: 'activity',
      paginationKeys: ['createdAt'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }
}
