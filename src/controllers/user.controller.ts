import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { UserService } from '../services/user.service'
import { ChangePasswordInput, EmailAndUsernameInput } from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { User } from '../entities'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { AuthService } from '../services/auth.service'

@Service()
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly biolinkService: BiolinkService,
    private readonly usernameService: UsernameService
  ) {}

  async changeUserEmailAddressAndUsername(
    emailAndUsernameInput: EmailAndUsernameInput,
    biolinkId: string,
    context: MyContext
  ): Promise<void> {
    console.log((context.user as User).id)
    await this.userService.updateUserById((context.user as User).id, {
      email: emailAndUsernameInput.email,
    })

    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      emailAndUsernameInput.username &&
      (await biolink.username)?.username !== emailAndUsernameInput.username
    ) {
      if (biolink.changedUsername) {
        throw new ApolloError(
          'Username already changed once',
          ErrorCode.USERNAME_ALREADY_CHANGED_ONCE
        )
      }

      if (
        await this.usernameService.isPremiumUsername(
          emailAndUsernameInput.username,
          (context.user as User).id
        )
      ) {
        throw new ApolloError('Premium username cannot be taken', ErrorCode.USERNAME_ALREADY_EXISTS)
      }

      const usernameDoc = await this.usernameService.findOneOrCreate(emailAndUsernameInput.username)

      await this.biolinkService.updateUserById(biolinkId, {
        username: usernameDoc,
      })
    }
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    context: MyContext
  ): Promise<void> {
    const user = await this.userService.getUserById((context.user as User).id)

    if (!(await this.authService.isPasswordMatched(user, changePasswordInput.oldPassword))) {
      throw new ApolloError('Password did not match', ErrorCode.PASSWORD_DID_NOT_MATCH)
    }
    await this.userService.updateUserById((context.user as User).id, {
      password: changePasswordInput.newPassword,
    })
  }
}
