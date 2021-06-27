import { Arg, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { UsernameConnection } from '../../object-types'
import {
  getPremiumUsernamesPaginated,
  getTrademarkUsernamesPaginated,
  getUsernamesPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'

@Resolver()
export class UsernameAdminResolver {
  @Query(() => UsernameConnection, { nullable: true })
  async getAllUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<UsernameConnection> {
    return await getUsernamesPaginated(options, adminUser)
  }

  @Query(() => UsernameConnection, { nullable: true })
  async getAllPremiumUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<UsernameConnection> {
    return await getPremiumUsernamesPaginated(options, adminUser)
  }

  @Query(() => UsernameConnection, { nullable: true })
  async getAllTrademarkUsernames(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User
  ): Promise<UsernameConnection> {
    return await getTrademarkUsernamesPaginated(options, adminUser)
  }
}
