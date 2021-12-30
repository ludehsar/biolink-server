import { ApolloError } from 'apollo-server-express'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'

import { BlacklistType } from '../enums'
import { BlackList } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedBlackListResponse } from '../object-types/common/PaginatedBlackListResponse'
import { ErrorCode } from '../types'
import { BlackListUpdateBody } from '../interfaces/BlackListUpdateBody'

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
   * Create black list
   * @param {BlackListUpdateBody} updateBody
   * @returns {Promise<BlackList>}
   */
  async createBlackList(updateBody: BlackListUpdateBody): Promise<BlackList> {
    let blacklist = await this.blackListRepository.create().save()

    blacklist = await this.updateBlacklistById(blacklist.id, updateBody)

    return blacklist
  }

  /**
   * Update black list by id
   * @param {string} blackListId
   * @param {BlackListUpdateBody} updateBody
   * @returns {Promise<BlackList>}
   */
  async updateBlacklistById(
    blackListId: string,
    updateBody: BlackListUpdateBody
  ): Promise<BlackList> {
    const blacklist = await this.getBlackListById(blackListId)

    if (updateBody.blacklistType !== undefined) blacklist.blacklistType = updateBody.blacklistType
    if (updateBody.keyword !== undefined) blacklist.keyword = updateBody.keyword
    if (updateBody.reason !== undefined) blacklist.reason = updateBody.reason

    try {
      await blacklist.save()
    } catch (err: any) {
      throw new ApolloError(err.message, ErrorCode.DATABASE_ERROR)
    }

    return blacklist
  }

  /**
   * Soft remove black list by id
   * @param {string} blackListId
   * @returns {Promise<BlackList>}
   */
  async softRemoveBlackListById(blackListId: string): Promise<BlackList> {
    const blacklist = await this.getBlackListById(blackListId)

    await blacklist.softRemove()

    return blacklist
  }

  /**
   * Get black list
   * @param {string} blackListId
   * @returns {Promise<BlackList>}
   */
  async getBlackListById(blackListId: string): Promise<BlackList> {
    const blacklist = await this.blackListRepository.findOne(blackListId)

    if (!blacklist) {
      throw new ApolloError('Black list not found', ErrorCode.BLACKLIST_NOT_FOUND)
    }

    return blacklist
  }

  /**
   * Get all black lists
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
