import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { BlackListConnection } from '../../object-types'
import {
  getBlackListedBadWordsPaginated,
  getBlackListedEmailsPaginated,
  getBlackListedUsernamesPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class BlackListAdminResolver {
  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedBadWords(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedBadWordsPaginated(options, adminUser, context)
  }

  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedEmails(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedEmailsPaginated(options, adminUser, context)
  }

  @Query(() => BlackListConnection, { nullable: true })
  async getAllBlackListedUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<BlackListConnection> {
    return await getBlackListedUsernamesPaginated(options, adminUser, context)
  }
}
