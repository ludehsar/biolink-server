import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, VerificationStatusInput } from '../../input-types'
import { DefaultResponse, VerificationConnection } from '../../object-types'
import {
  changeVerificationStatus,
  getPendingVerificationsPaginated,
  getRejectedVerificationsPaginated,
  getVerifiedVerificationsPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class VerificationAdminResolver {
  @Query(() => VerificationConnection, { nullable: true })
  async getAllPendingVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getPendingVerificationsPaginated(options, adminUser, context)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllVerifiedVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getVerifiedVerificationsPaginated(options, adminUser, context)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllRejectedVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getRejectedVerificationsPaginated(options, adminUser, context)
  }

  @Mutation(() => DefaultResponse, { nullable: true })
  async changeVerificationStatus(
    @Arg('verificationId', () => String) verificationId: string,
    @Arg('options', () => VerificationStatusInput) options: VerificationStatusInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await changeVerificationStatus(verificationId, options, adminUser, context)
  }
}
