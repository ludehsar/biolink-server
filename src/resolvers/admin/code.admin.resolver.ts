import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { CodeConnection } from '../../object-types'
import { getDiscountCodesPaginated, getReferralCodesPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from 'types'

@Resolver()
export class CodeAdminResolver {
  @Query(() => CodeConnection, { nullable: true })
  async getAllDiscounts(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeConnection> {
    return await getDiscountCodesPaginated(options, adminUser, context)
  }

  @Query(() => CodeConnection, { nullable: true })
  async getAllReferrals(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeConnection> {
    return await getReferralCodesPaginated(options, adminUser, context)
  }
}
