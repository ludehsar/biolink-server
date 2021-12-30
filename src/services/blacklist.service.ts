import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'

import { BlacklistType } from '../enums'
import { BlackList } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedBlackListResponse } from '../object-types/common/PaginatedBlackListResponse'

@Service()
export class BlackListService {
  constructor(
    @InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>
  ) {}

  /**
   * Checks if a keyword is blacklisted
   * @param {string} keyword
   * @param {BlacklistType} blacklistType
   * @returns {Promise<BlackList>}
   */
  async isKeywordBlacklisted(keyword: string, blacklistType: BlacklistType): Promise<boolean> {
    const record = await this.blackListRepository.findOne({
      where: {
        blacklistType,
        keyword,
      },
    })

    return !!record
  }

  /**
   * Get all categoris
   * @param {BlacklistType} blacklistType
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedUserLogResponse>}
   */
  async getAllBlackLists(
    blacklistType: BlacklistType,
    options: ConnectionArgs
  ): Promise<PaginatedBlackListResponse> {
    const queryBuilder = this.blackListRepository
      .createQueryBuilder('blacklist')
      .where('blacklist.blacklistType = :blacklistType', { blacklistType })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(blacklist.keyword) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          }).orWhere(`LOWER(blacklist.reason) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
        })
      )

    const paginator = buildPaginator({
      entity: BlackList,
      alias: 'blacklist',
      paginationKeys: ['id'],
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
