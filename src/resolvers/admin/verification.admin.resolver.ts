import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { VerificationConnection } from '../../object-types'
import {
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
}
