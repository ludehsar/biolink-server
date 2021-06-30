import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { ReferralInput } from '../../input-types'
import { ReferralResponse } from '../../object-types'
import { getUserReferrals, createReferrals } from '../../services'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from '../../types'

@Resolver()
export class ReferralResolver {
  @Query(() => ReferralResponse)
  async getReferralsList(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<ReferralResponse> {
    return await getUserReferrals(user, context)
  }

  @Mutation(() => ReferralResponse)
  async createReferrals(
    @Arg('referralOptions') referralOptions: ReferralInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ReferralResponse> {
    return await createReferrals(referralOptions, user, context)
  }
}
