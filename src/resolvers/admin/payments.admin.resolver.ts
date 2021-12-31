import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { Payment } from '../../entities'
import { PaginatedPaymentResponse } from '../../object-types/common/PaginatedPaymentResponse'
import { PaymentController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class PaymentsAdminResolver {
  constructor(private readonly paymentController: PaymentController) {}

  @Query(() => PaginatedPaymentResponse, { nullable: true })
  @UseMiddleware(authAdmin('payment.canShowList'))
  async getAllPayments(@Arg('options') options: ConnectionArgs): Promise<PaginatedPaymentResponse> {
    return await this.paymentController.getAllPayments(options)
  }

  @Query(() => Payment, { nullable: true })
  @UseMiddleware(authAdmin('payment.canShow'))
  async getPayment(@Arg('paymentId', () => String) paymentId: string): Promise<Payment> {
    return await this.paymentController.getPaymentDetailsByAdmins(paymentId)
  }
}
