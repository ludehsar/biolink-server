import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Service as ServiceEntity } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedServiceResponse } from '../object-types/common/PaginatedServiceResponse'
import { ServiceUpdateBody } from '../interfaces/ServiceUpdateBody'

@Service()
export class AccessService {
  constructor(
    @InjectRepository(ServiceEntity) private readonly serviceRepository: Repository<ServiceEntity>
  ) {}

  /**
   * Create a service
   * @param {ServiceUpdateBody} updateBody
   * @returns {Promise<Service>}
   */
  async createService(updateBody: ServiceUpdateBody): Promise<ServiceEntity> {
    let service = await this.serviceRepository.create().save()

    service = await this.updateServiceById(service.id, updateBody)

    return service
  }

  /**
   * Get service by Id
   * @param {string} serviceId
   * @returns {Promise<ServiceEntity>}
   */
  async getServiceById(serviceId: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne(serviceId)

    if (!service) {
      throw new ApolloError('Invalid service id', ErrorCode.SERVICE_NOT_FOUND)
    }

    return service
  }

  /**
   * Update service by service id
   * @param {string} serviceId
   * @param {ServiceUpdateBody} updateBody
   * @returns {Promise<Service>}
   */
  async updateServiceById(
    serviceId: string,
    updateBody: ServiceUpdateBody
  ): Promise<ServiceEntity> {
    const service = await this.getServiceById(serviceId)

    if (!service) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if (updateBody.blacklisted !== undefined) service.blacklisted = updateBody.blacklisted
    if (updateBody.description !== undefined) service.description = updateBody.description
    if (updateBody.price !== undefined) service.price = updateBody.price
    if (updateBody.seller !== undefined) service.seller = Promise.resolve(updateBody.seller)
    if (updateBody.title !== undefined) service.title = updateBody.title

    await service.save()
    return service
  }

  /**
   * Get all followed services by user id
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedServiceResponse>}
   */
  async getAllServicesByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedServiceResponse> {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .where('service.sellerId = :userId', { userId: userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(service.title) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          }).orWhere(`LOWER(service.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
        })
      )

    const paginator = buildPaginator({
      entity: ServiceEntity,
      alias: 'service',
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

  /**
   * Soft remove service by Id
   * @param {string} serviceId
   * @returns {Promise<ServiceEntity>}
   */
  async softRemoveServiceById(serviceId: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne(serviceId)

    if (!service) {
      throw new ApolloError('Invalid service id', ErrorCode.SERVICE_NOT_FOUND)
    }

    await service.softRemove()

    return service
  }
}
