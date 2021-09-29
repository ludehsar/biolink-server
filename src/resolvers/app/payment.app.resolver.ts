import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgsOld } from '../../input-types'
import { PaymentConnection, PaymentResponse } from '../../object-types'
import { getPayment, getUserPaymentsPaginated } from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class PaymentResolver {
  @Query(() => PaymentConnection, { nullable: true })
  async getAllUserPayments(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<PaymentConnection> {
    return await getUserPaymentsPaginated(options, user, context)
  }

  @Query(() => PaymentResponse, { nullable: true })
  async getPayment(
    @Arg('paymentId', () => String) paymentId: number,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<PaymentResponse> {
    return await getPayment(paymentId, user, context)
  }
}
