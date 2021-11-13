import { Service } from 'typedi'
import { ForbiddenError } from 'apollo-server-errors'

import { MyContext } from '../types'
import { Order, User } from '../entities'
import { ConnectionArgs, NewOrderInput } from '../input-types'
import { OrderService } from '../services/order.service'
import { PaginatedOrderResponse } from '../object-types/common/PaginatedOrderResponse'
import { AccessService } from '../services/access.service'

@Service()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly accessService: AccessService
  ) {}

  async getOrder(orderId: string, context: MyContext): Promise<Order> {
    const order = await this.orderService.getOrderById(orderId)

    if (
      order.buyerId !== (context.user as User).id &&
      (await order.service).sellerId !== (context.user as User).id
    ) {
      throw new ForbiddenError('Forbidden')
    }

    return order
  }

  async createOrder(serviceId: string, input: NewOrderInput, context: MyContext): Promise<Order> {
    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId === (context.user as User).id) {
      throw new ForbiddenError('Cannot buy your own service')
    }

    return await this.orderService.createOrder({
      buyer: context.user,
      description: input.description,
      orderCompleted: false,
      price: input.price,
      service: service,
    })
  }

  async markCompleted(orderId: string, context: MyContext): Promise<Order> {
    const order = await this.orderService.getOrderById(orderId)

    if ((await order.service).sellerId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.orderService.updateOrderById(orderId, {
      orderCompleted: true,
    })
  }

  async getAllServiceOrders(
    serviceId: string,
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedOrderResponse> {
    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.orderService.getAllOrdersByServiceId(serviceId, options)
  }

  async getAllSentOrders(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedOrderResponse> {
    return await this.orderService.getAllOrdersByBuyerId((context.user as User).id, options)
  }
}
