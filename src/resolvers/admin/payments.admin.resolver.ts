import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { PaymentConnection } from '../../object-types'
import { getStripePaymentsPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'

@Resolver()
export class PaymentsAdminResolver {
  @Query(() => PaymentConnection, { nullable: true })
  async getAllStripePayments(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<PaymentConnection> {
    return await getStripePaymentsPaginated(options, adminUser)
  }
}
