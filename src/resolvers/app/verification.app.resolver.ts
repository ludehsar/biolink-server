import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { VerificationInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { createVerification } from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class VerificationResolver {
  @Mutation(() => DefaultResponse)
  async verifyBiolink(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('options') options: VerificationInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await createVerification(options, biolinkId, user, context)
  }
}
