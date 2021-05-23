import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { createReferrals, getReferralsList } from '../../controllers/app/referral.controller'
import { MyContext } from '../../MyContext'
import { ReferralResponse, ReferralInput } from '../../typeDefs/referral.typeDef'

@Resolver()
export class ReferralResolver {
  @Query(() => ReferralResponse)
  async getReferralsList(@CurrentUser() user: User): Promise<ReferralResponse> {
    return await getReferralsList(user)
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
