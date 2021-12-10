import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { ConnectionArgs, NewOrderInput, NewServiceInput } from '../../input-types'
import { Order, Service } from '../../entities'
import { authUser, emailVerified } from '../../middlewares'
import { OrderController, ServiceController } from '../../controllers'
import { PaginatedServiceResponse } from '../../object-types/common/PaginatedServiceResponse'
import { PaginatedOrderResponse } from '../../object-types/common/PaginatedOrderResponse'

@Resolver()
export class ServiceResolver {
  constructor(
    private readonly serviceController: ServiceController,
    private readonly orderController: OrderController
  ) {}

  @Mutation(() => Service, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async createService(
    @Arg('options') options: NewServiceInput,
    @Ctx() context: MyContext
  ): Promise<Service> {
    return await this.serviceController.createService(options, context)
  }

  @Mutation(() => Service, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async editService(
    @Arg('serviceId') serviceId: string,
    @Arg('options') options: NewServiceInput,
    @Ctx() context: MyContext
  ): Promise<Service> {
    return await this.serviceController.editService(serviceId, options, context)
  }

  @Mutation(() => Service, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async deleteService(
    @Arg('serviceId') serviceId: string,
    @Ctx() context: MyContext
  ): Promise<Service> {
    return await this.serviceController.deleteService(serviceId, context)
  }

  @Query(() => Service, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getService(@Arg('serviceId') serviceId: string): Promise<Service> {
    return await this.serviceController.getService(serviceId)
  }

  @Query(() => PaginatedServiceResponse, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getAllUserServices(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedServiceResponse> {
    return await this.serviceController.getAllUserServices(options, context)
  }

  @Query(() => PaginatedServiceResponse, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getAllServicesByUserId(
    @Arg('userId') userId: string,
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedServiceResponse> {
    return await this.serviceController.getAllServicesByUserId(userId, options)
  }

  @Mutation(() => String, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async createPaypalOrder(
    @Arg('serviceId') serviceId: string,
    @Ctx() context: MyContext
  ): Promise<string> {
    return await this.orderController.createPaypalOrder(serviceId, context)
  }

  @Mutation(() => Order, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async capturePaypalOrder(
    @Arg('orderId') orderId: string,
    @Arg('serviceId') serviceId: string,
    @Arg('options') options: NewOrderInput,
    @Ctx() context: MyContext
  ): Promise<Order> {
    return await this.orderController.capturePaypalOrder(orderId, serviceId, options, context)
  }

  @Mutation(() => Order, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async orderCompleted(@Arg('orderId') orderId: string, @Ctx() context: MyContext): Promise<Order> {
    return await this.orderController.markCompleted(orderId, context)
  }

  @Query(() => PaginatedOrderResponse, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getAllServiceOrders(
    @Arg('serviceId') serviceId: string,
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedOrderResponse> {
    return await this.orderController.getAllServiceOrders(serviceId, options, context)
  }

  @Query(() => PaginatedOrderResponse, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getAllSentOrders(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedOrderResponse> {
    return await this.orderController.getAllSentOrders(options, context)
  }

  @Query(() => Order, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async getServiceOrder(
    @Arg('orderId') orderId: string,
    @Ctx() context: MyContext
  ): Promise<Order> {
    return await this.orderController.getOrder(orderId, context)
  }
}
