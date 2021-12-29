import { Mutation, Arg, Ctx, Resolver } from 'type-graphql'

import { UserWithTokens } from '../../object-types'
import { MyContext } from '../../types'
import { AuthController } from '../../controllers'
import { LoginInput } from '../../input-types'

@Resolver()
export class AuthAdminResolver {
  constructor(private readonly authController: AuthController) {}
  @Mutation(() => UserWithTokens)
  async loginAdmin(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.loginAdmin(options, context)
  }
}
