import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { VerificationConnection } from '../../object-types'
import {
  getPendingVerificationsPaginated,
  getRejectedVerificationsPaginated,
  getVerifiedVerificationsPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'

@Resolver()
export class VerificationAdminResolver {
  @Query(() => VerificationConnection, { nullable: true })
  async getAllPendingVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<VerificationConnection> {
    return await getPendingVerificationsPaginated(options, adminUser)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllVerifiedVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<VerificationConnection> {
    return await getVerifiedVerificationsPaginated(options, adminUser)
  }

  @Query(() => VerificationConnection, { nullable: true })
  async getAllRejectedVerifications(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<VerificationConnection> {
    return await getRejectedVerificationsPaginated(options, adminUser)
  }
}
