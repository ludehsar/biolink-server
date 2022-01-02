import { authUser, emailVerified } from '../../middlewares'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { Verification } from '../../entities'
import { VerificationInput } from '../../input-types'
import { MyContext } from '../../types'
import { VerificationController } from '../../controllers'

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationController: VerificationController) {}

  @Mutation(() => Verification)
  @UseMiddleware(authUser, emailVerified)
  async verifyBiolink(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('options') options: VerificationInput,
    @Ctx() context: MyContext
  ): Promise<Verification> {
    return await this.verificationController.addVerification(biolinkId, options, context)
  }
}
