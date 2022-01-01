import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewUsernameInput } from '../../input-types'
import { Username } from '../../entities'
import { UsernameController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { PaginatedUsernameResponse } from '../../object-types/common/PaginatedUsernameResponse'

@Resolver()
export class UsernameAdminResolver {
  constructor(private readonly usernameController: UsernameController) {}

  @Query(() => PaginatedUsernameResponse, { nullable: true })
  @UseMiddleware(authAdmin('username.canShowList'))
  async getAllUsernames(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedUsernameResponse> {
    return await this.usernameController.getAllUsernames(options)
  }

  @Query(() => PaginatedUsernameResponse, { nullable: true })
  @UseMiddleware(authAdmin('username.canShowList'))
  async getAllPremiumUsernames(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedUsernameResponse> {
    return await this.usernameController.getAllPremiumUsernames(options)
  }

  @Query(() => PaginatedUsernameResponse, { nullable: true })
  @UseMiddleware(authAdmin('username.canShowList'))
  async getAllTrademarkUsernames(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedUsernameResponse> {
    return await this.usernameController.getAllTrademarkUsernames(options)
  }

  @Query(() => Username, { nullable: true })
  @UseMiddleware(authAdmin('username.canShow'))
  async getUsername(@Arg('usernameId', () => String) usernameId: string): Promise<Username> {
    return await this.usernameController.getUsername(usernameId)
  }

  @Mutation(() => Username, { nullable: true })
  @UseMiddleware(authAdmin('username.canCreate'))
  async addUsername(@Arg('options') options: NewUsernameInput): Promise<Username> {
    return await this.usernameController.addUsername(options)
  }

  @Mutation(() => Username, { nullable: true })
  @UseMiddleware(authAdmin('username.canEdit'))
  async editUsername(
    @Arg('usernameId', () => String) usernameId: string,
    @Arg('options') options: NewUsernameInput
  ): Promise<Username> {
    return await this.usernameController.editUsername(usernameId, options)
  }

  @Mutation(() => Username, { nullable: true })
  @UseMiddleware(authAdmin('username.canDelete'))
  async deleteUsername(@Arg('usernameId', () => String) usernameId: string): Promise<Username> {
    return await this.usernameController.deleteUsername(usernameId)
  }
}
