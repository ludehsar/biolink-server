import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { BooleanResponse } from '../../typeDefs/common.typeDef'
import { createVerification } from '../../controllers/verification.controller'
import { MyContext } from '../../MyContext'
import { VerificationInput } from '../../typeDefs/verification.typeDef'

@Resolver()
export class VerificationResolver {
  @Mutation(() => BooleanResponse)
  async verifyBiolinkByUsername(
    @Arg('options') options: VerificationInput,
    @Arg('biolinkUsername') biolinkUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await createVerification(options, biolinkUsername, user, context)
  }
}
