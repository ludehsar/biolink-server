import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { Referral } from '../../entities'
import { ConnectionArgs, ReferralInput } from '../../input-types'
import { MyContext } from '../../types'
import { ReferralController } from '../../controllers'
import { PaginatedReferralResponse } from '../../object-types/common/PaginatedReferralResponse'
import { PaginatedUserResponse } from '../../object-types/common/PaginatedUserResponse'
import { authUser, emailVerified } from '../../middlewares'

@Resolver()
export class ReferralResolver {
  constructor(private readonly referralController: ReferralController) {}

  @Query(() => PaginatedReferralResponse)
  @UseMiddleware(authUser)
  async getSentEmailReferrals(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedReferralResponse> {
    return await this.referralController.getAllSentEmailReferrals(options, context)
  }

  @Mutation(() => [Referral])
  @UseMiddleware(authUser, emailVerified)
  async createReferrals(
    @Arg('referralOptions') referralOptions: ReferralInput,
    @Ctx() context: MyContext
  ): Promise<Referral[]> {
    return await this.referralController.createReferrals(referralOptions, context)
  }

  @Query(() => PaginatedUserResponse, { nullable: true })
  @UseMiddleware(authUser)
  async getUsedCodesUsers(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedUserResponse> {
    return await this.referralController.getAllUsersRegisteredWithReferralCodes(options, context)
  }
}
