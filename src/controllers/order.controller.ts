import { Service } from 'typedi'
import { ForbiddenError } from 'apollo-server-errors'

import { MyContext } from '../types'
import { Order, User } from '../entities'
import { ConnectionArgs, NewOrderInput } from '../input-types'
import { OrderService } from '../services/order.service'
import { PaginatedOrderResponse } from '../object-types/common/PaginatedOrderResponse'
import { AccessService } from '../services/access.service'
import { PaymentService } from '../services/payment.service'
import { PaymentCurrency, PaymentProvider, PaymentType } from '../enums'
import { UserService } from '../services/user.service'

@Service()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly accessService: AccessService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService
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

  async createPaypalOrder(serviceId: string, context: MyContext): Promise<string> {
    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId === (context.user as User).id) {
      throw new ForbiddenError('Cannot buy your own service')
    }

    return await this.paymentService.paypalCheckoutCreateOrder(service)
  }

  async capturePaypalOrder(
    orderId: string,
    serviceId: string,
    input: NewOrderInput,
    context: MyContext
  ): Promise<Order> {
    const paypalPaymentInfo = await this.paymentService.paypalCheckoutCaptureOrder(orderId)

    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId === (context.user as User).id) {
      throw new ForbiddenError('Cannot buy your own service')
    }

    const order = await this.orderService.createOrder({
      buyer: context.user,
      description: input.description,
      orderCompleted: false,
      price: input.price,
      service: service,
    })

    const amountPaid = paypalPaymentInfo.purchase_units.reduce(
      (sum, purchase_unit) =>
        sum +
        purchase_unit.payments.captures.reduce(
          (sum2, capture) => sum2 + parseFloat(capture.amount.value),
          0
        ),
      0
    )

    await this.paymentService.savePayment({
      amountPaid,
      order,
      paymentCurrency: PaymentCurrency.USD,
      paymentDetails: paypalPaymentInfo,
      paymentProvider: PaymentProvider.PayPal,
      paymentType: PaymentType.Checkout,
      representedId: paypalPaymentInfo.id,
      user: context.user,
    })

    // TODO: Add money to service provider's account

    return order
  }

  async markCompleted(orderId: string, context: MyContext): Promise<Order> {
    const order = await this.orderService.getOrderById(orderId)

    if ((await order.service).sellerId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    await this.userService.updateUserById((context.user as User).id, {
      availableBalance: (context.user as User).availableBalance + order.price,
    })

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
