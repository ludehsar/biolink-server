import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { SupportConnection, SupportResponse } from '../../object-types'
import {
  getDismissedSupportsPaginated,
  getPendingSupportsPaginated,
  getResolvedSupportsPaginated,
  getSupport,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class SupportAdminResolver {
  @Query(() => SupportConnection, { nullable: true })
  async getAllPendingSupports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<SupportConnection> {
    return await getPendingSupportsPaginated(options, adminUser, context)
  }

  @Query(() => SupportConnection, { nullable: true })
  async getAllResolvedSupports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<SupportConnection> {
    return await getResolvedSupportsPaginated(options, adminUser, context)
  }

  @Query(() => SupportConnection, { nullable: true })
  async getAllDismissedSupports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<SupportConnection> {
    return await getDismissedSupportsPaginated(options, adminUser, context)
  }

  @Query(() => SupportResponse, { nullable: true })
  async getSupport(
    @Arg('supportId', () => String) supportId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<SupportResponse> {
    return await getSupport(supportId, adminUser, context)
  }
}
