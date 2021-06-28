import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { TaxConnection } from '../../object-types'
import { getTaxesPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'

@Resolver()
export class TaxAdminResolver {
  @Query(() => TaxConnection, { nullable: true })
  async getAllTaxes(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<TaxConnection> {
    return await getTaxesPaginated(options, adminUser)
  }
}
