import { Arg, Ctx, Query, Resolver } from 'type-graphql'

import { MyContext } from '../../types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { LinkConnection } from '../../object-types'
import { getEmbedsPaginated, getLinksPaginated } from '../../services'

@Resolver()
export class LinkAdminResolver {
  @Query(() => LinkConnection, { nullable: true })
  async getAllLinks(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<LinkConnection> {
    return await getLinksPaginated(options, adminUser, context)
  }

  @Query(() => LinkConnection, { nullable: true })
  async getAllEmbeds(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<LinkConnection> {
    return await getEmbedsPaginated(options, adminUser, context)
  }
}
