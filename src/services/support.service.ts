import { ApolloError } from 'apollo-server-express'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Support } from '../entities'
import { ResolveStatus } from '../enums'
import { SupportUpdateBody } from '../interfaces/SupportUpdateBody'
import { ConnectionArgs } from '../input-types'
import { PaginatedSupportResponse } from '../object-types/common/PaginatedSupportSettings'

@Service()
export class SupportService {
  constructor(@InjectRepository(Support) private readonly supportRepository: Repository<Support>) {}

  /**
   * Creates a new support
   * @param {SupportUpdateBody} updateBody
   * @returns {Promise<boolean>}
   */
  async createSupport(updateBody: SupportUpdateBody): Promise<Support> {
    const support = this.supportRepository.create({
      company: updateBody.company,
      email: updateBody.email,
      fullName: updateBody.fullName,
      message: updateBody.message,
      phoneNumber: updateBody.phoneNumber,
      status: ResolveStatus.Pending,
      subject: updateBody.subject,
    })

    if (updateBody.user !== undefined) support.user = Promise.resolve(updateBody.user)

    await support.save()

    return support
  }

  /**
   * Get support by support id
   * @param {string} supportId
   * @returns {Promise<Support>}
   */
  async getSupportBySupportId(supportId: string): Promise<Support> {
    const support = await this.supportRepository.findOne(supportId)

    if (!support) {
      throw new ApolloError('Support not found', ErrorCode.REPORT_NOT_FOUND)
    }

    return support
  }

  /**
   * Get support by support id
   * @param {string} supportId
   * @param {SupportUpdateBody} updateBody
   * @returns {Promise<Support>}
   */
  async replySupportBySupportId(
    supportId: string,
    updateBody: SupportUpdateBody
  ): Promise<Support> {
    const support = await this.getSupportBySupportId(supportId)

    if (updateBody.status !== undefined) support.status = updateBody.status
    if (updateBody.supportReply !== undefined) support.supportReply = updateBody.supportReply
    await support.save()

    return support
  }

  /**
   * Get all supports
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedSupportResponse>}
   */
  async getAllSupports(
    status: ResolveStatus,
    options: ConnectionArgs
  ): Promise<PaginatedSupportResponse> {
    const queryBuilder = this.supportRepository
      .createQueryBuilder('support')
      .where('support.status = :status', { status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(support.message) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(support.email) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(support.fullName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(support.company) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(support.phoneNumber) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(support.subject) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Support,
      alias: 'support',
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
