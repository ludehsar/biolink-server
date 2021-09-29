import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser, emailVerified } from '../../middlewares'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import {
  EmailAndUsernameInput,
  ChangePasswordInput,
  PasswordInput,
  BillingInput,
  ConnectionArgs,
} from '../../input-types'
import { ActivityConnection } from '../../object-types'
import { getUserActivityPaginated } from '../../services'
import { MyContext } from '../../types'
import { UserController } from '../../controllers'

@Resolver(User)
export class UserResolver {
  constructor(private readonly userController: UserController) {}

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async changeUserAccountInfo(
    @Arg('options') options: EmailAndUsernameInput,
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changeUserEmailAddressAndUsername(options, biolinkId, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async changeUserPassword(
    @Arg('options') options: ChangePasswordInput,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.changePassword(options, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async deleteUserAccount(
    @Arg('options') options: PasswordInput,
    @Ctx() context: MyContext
  ): Promise<void> {
    return await this.userController.deleteUserAccount(options, context)
  }

  @Mutation(() => User)
  @UseMiddleware(authUser, emailVerified)
  async updateBilling(
    @Arg('options') options: BillingInput,
    @Ctx() context: MyContext
  ): Promise<User> {
    return await this.userController.updateBilling(options, context)
  }

  @Mutation(() => User)
  @UseMiddleware(authUser)
  async changeCurrentBiolinkId(
    @Arg('biolinkId', () => String) biolinkId: string,
    @Ctx() context: MyContext
  ): Promise<User> {
    return await this.userController.updateCurrentBiolink(biolinkId, context)
  }

  @Query(() => ActivityConnection, { nullable: true })
  @UseMiddleware(authUser)
  async getUserActivity(
    @Arg('options') options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<ActivityConnection> {
    return await getUserActivityPaginated(options, user, context)
  }
}
