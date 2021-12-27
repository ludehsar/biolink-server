import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

import { Payment } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { authUser } from '../../middlewares'
import { MyContext } from '../../types'
import { PaymentController } from '../../controllers'
import { PaginatedPaymentResponse } from '../../object-types/common/PaginatedPaymentResponse'

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentController: PaymentController) {}

  @Query(() => PaginatedPaymentResponse, { nullable: true })
  @UseMiddleware(authUser)
  async getAllUserPayments(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedPaymentResponse> {
    return await this.paymentController.getAllUserPayments(options, context)
  }

  @Query(() => Payment, { nullable: true })
  @UseMiddleware(authUser)
  async getPayment(
    @Arg('paymentId', () => String) paymentId: string,
    @Ctx() context: MyContext
  ): Promise<Payment> {
    return await this.paymentController.getPaymentDetails(paymentId, context)
  }

  @Query(() => Payment, { nullable: true })
  @UseMiddleware(authUser)
  async getLastUserPayment(@Ctx() context: MyContext): Promise<Payment> {
    return await this.paymentController.getLastUserPayment(context)
  }
}
