import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Order } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedOrderResponse } from '../object-types/common/PaginatedOrderResponse'
import { OrderUpdateBody } from '../interfaces/OrderUpdateBody'

@Service()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

  /**
   * Create a order
   * @param {OrderUpdateBody} updateBody
   * @returns {Promise<Order>}
   */
  async createOrder(updateBody: OrderUpdateBody): Promise<Order> {
    let order = await this.orderRepository.create().save()

    order = await this.updateOrderById(order.id, updateBody)

    return order
  }

  /**
   * Get order by Id
   * @param {string} orderId
   * @returns {Promise<Order>}
   */
  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId)

    if (!order) {
      throw new ApolloError('Invalid order id', ErrorCode.ORDER_NOT_FOUND)
    }

    return order
  }

  /**
   * Update order by order id
   * @param {string} orderId
   * @param {OrderUpdateBody} updateBody
   * @returns {Promise<Order>}
   */
  async updateOrderById(orderId: string, updateBody: OrderUpdateBody): Promise<Order> {
    const order = await this.getOrderById(orderId)

    if (!order) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if (updateBody.buyer) order.buyer = Promise.resolve(updateBody.buyer)
    if (updateBody.description) order.description = updateBody.description
    if (updateBody.orderCompleted) order.orderCompleted = updateBody.orderCompleted
    if (updateBody.price) order.price = updateBody.price
    if (updateBody.service) order.service = Promise.resolve(updateBody.service)

    await order.save()
    return order
  }

  /**
   * Get all orders by service id
   * @param {string} serviceId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedOrderResponse>}
   */
  async getAllOrdersByServiceId(
    serviceId: string,
    options: ConnectionArgs
  ): Promise<PaginatedOrderResponse> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.service', 'service')
      .where('order.serviceId = :serviceId', { serviceId: serviceId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(order.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
        })
      )

    const paginator = buildPaginator({
      entity: Order,
      alias: 'order',
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
   * Get all orders by buyer id
   * @param {string} buyerId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedOrderResponse>}
   */
  async getAllOrdersByBuyerId(
    buyerId: string,
    options: ConnectionArgs
  ): Promise<PaginatedOrderResponse> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.service', 'service')
      .where('order.buyerId = :buyerId', { buyerId: buyerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(order.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
        })
      )

    const paginator = buildPaginator({
      entity: Order,
      alias: 'order',
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
   * Soft remove order by Id
   * @param {string} orderId
   * @returns {Promise<Order>}
   */
  async softRemoveOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId)

    if (!order) {
      throw new ApolloError('Invalid order id', ErrorCode.ORDER_NOT_FOUND)
    }

    await order.softRemove()

    return order
  }
}
