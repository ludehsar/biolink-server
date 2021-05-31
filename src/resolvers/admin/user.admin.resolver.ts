import { Arg, Query, Resolver } from 'type-graphql'

import { UserConnection } from '../../object-types'
import { ConnectionArgs } from '../../input-types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { getUsersPaginated } from '../../services'

@Resolver()
export class UserAdminResolver {
  @Query(() => UserConnection, { nullable: true })
  async getAllUsers(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() admin: User
  ): Promise<UserConnection> {
    return await getUsersPaginated(options, admin)
  }
}
