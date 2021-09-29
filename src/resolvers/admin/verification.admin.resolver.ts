import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgsOld, VerificationStatusInput } from '../../input-types'
import { VerificationConnection, VerificationResponse } from '../../object-types'
import {
  changeVerificationStatus,
  getPendingVerificationsPaginated,
  getRejectedVerificationsPaginated,
  getVerification,
  getVerifiedVerificationsPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class VerificationAdminResolver {
  @Query(() => VerificationConnection, { nullable: true })
  async getAllPendingVerifications(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getPendingVerificationsPaginated(options, adminUser, context)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllVerifiedVerifications(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getVerifiedVerificationsPaginated(options, adminUser, context)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllRejectedVerifications(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getRejectedVerificationsPaginated(options, adminUser, context)
  }

  @Query(() => VerificationResponse, { nullable: true })
  async getVerification(
    @Arg('verificationId', () => String) verificationId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationConnection> {
    return await getVerification(verificationId, adminUser, context)
  }

  @Mutation(() => VerificationResponse, { nullable: true })
  async changeVerificationStatus(
    @Arg('verificationId', () => String) verificationId: string,
    @Arg('options', () => VerificationStatusInput) options: VerificationStatusInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<VerificationResponse> {
    return await changeVerificationStatus(verificationId, options, adminUser, context)
  }
}
