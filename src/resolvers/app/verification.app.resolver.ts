import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { VerificationInput } from '../../input-types'
import { ErrorResponse } from '../../object-types'
import { createVerification } from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class VerificationResolver {
  @Mutation(() => [ErrorResponse])
  async verifyBiolinkByUsername(
    @Arg('options') options: VerificationInput,
    @Arg('biolinkUsername') biolinkUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ErrorResponse[]> {
    return await createVerification(options, biolinkUsername, user, context)
  }
}
