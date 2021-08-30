import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgs, ReferralInput } from '../../input-types'
import { DefaultResponse, ReferralConnection } from '../../object-types'
import { createReferrals, getSentEmailReferralsPaginated } from '../../services'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from '../../types'

@Resolver()
export class ReferralResolver {
  @Query(() => ReferralConnection)
  async getSentEmailReferrals(
    @Arg('options') options: ConnectionArgs,
    @CurrentUser() user: User
  ): Promise<ReferralConnection> {
    return await getSentEmailReferralsPaginated(options, user)
  }

  @Mutation(() => DefaultResponse)
  async createReferrals(
    @Arg('referralOptions') referralOptions: ReferralInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await createReferrals(referralOptions, user, context)
  }
}
