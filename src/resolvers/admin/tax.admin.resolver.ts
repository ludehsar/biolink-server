import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { TaxConnection } from '../../object-types'
import { getTaxesPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from 'types'

@Resolver()
export class TaxAdminResolver {
  @Query(() => TaxConnection, { nullable: true })
  async getAllTaxes(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<TaxConnection> {
    return await getTaxesPaginated(options, adminUser, context)
  }
}
