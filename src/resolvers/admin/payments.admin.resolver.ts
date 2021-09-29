import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgsOld } from '../../input-types'
import { PaymentConnection, PaymentResponse } from '../../object-types'
import { getPayment, getStripePaymentsPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class PaymentsAdminResolver {
  @Query(() => PaymentConnection, { nullable: true })
  async getAllStripePayments(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PaymentConnection> {
    return await getStripePaymentsPaginated(options, adminUser, context)
  }

  @Query(() => PaymentResponse, { nullable: true })
  async getPayment(
    @Arg('paymentId', () => String) paymentId: number,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<PaymentResponse> {
    return await getPayment(paymentId, adminUser, context)
  }
}
