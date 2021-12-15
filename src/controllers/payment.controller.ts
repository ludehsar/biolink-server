import { ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { MyContext } from '../types'
import { PaymentService } from '../services/payment.service'
import { PaginatedPaymentResponse } from '../object-types/common/PaginatedPaymentResponse'
import { Payment, User } from '../entities'
import { ConnectionArgs } from '../input-types'

@Service()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async getAllUserPayments(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedPaymentResponse> {
    return await this.paymentService.getAllUserPayments((context.user as User).id, options)
  }

  async getPaymentDetails(paymentId: string, context: MyContext): Promise<Payment> {
    const payment = await this.paymentService.getPaymentByPaymentId(paymentId)

    if (payment.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return payment
  }
}
