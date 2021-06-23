import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { BlackListConnection } from '../../object-types'
import { getBlackListedUsernamesPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'

@Resolver()
export class BlackListAdminResolver {
  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<BlackListConnection> {
    return await getBlackListedUsernamesPaginated(options, adminUser)
  }
}
