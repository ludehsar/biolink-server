import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { UserService } from '../services/user.service'
import {
  BillingInput,
  ChangePasswordInput,
  ConnectionArgs,
  EmailAndUsernameInput,
  PasswordInput,
} from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { User } from '../entities'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { AuthService } from '../services/auth.service'
import { BillingType } from '../enums'
import { NotificationService } from '../services/notification.service'
import { PaginatedUserLogResponse } from '../object-types'

@Service()
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly biolinkService: BiolinkService,
    private readonly usernameService: UsernameService,
    private readonly notificationService: NotificationService
  ) {}

  async changeUserEmailAddressAndUsername(
    emailAndUsernameInput: EmailAndUsernameInput,
    biolinkId: string,
    context: MyContext
  ): Promise<void> {
    const user = await this.userService.updateUserById((context.user as User).id, {
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

      const usernameDoc = await this.usernameService.findAvailableOneOrCreate(
        emailAndUsernameInput.username
      )

      await this.biolinkService.updateBiolinkById(biolinkId, {
        username: usernameDoc,
      })
    }

    await this.notificationService.createUserLogs(
      user,
      context,
      'Changed user email or username',
      true
    )
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    context: MyContext
  ): Promise<void> {
    const user = context.user as User

    if (!(await this.authService.isPasswordMatched(user, changePasswordInput.oldPassword))) {
      throw new ApolloError('Password did not match', ErrorCode.PASSWORD_DID_NOT_MATCH)
    }
    await this.userService.updateUserById((context.user as User).id, {
      password: changePasswordInput.newPassword,
    })

    await this.notificationService.createUserLogs(user, context, 'Changed user password', false)
  }

  async deleteUserAccount(passwordInput: PasswordInput, context: MyContext): Promise<void> {
    const user = context.user as User

    if (!(await this.authService.isPasswordMatched(user, passwordInput.password))) {
      throw new ApolloError('Password did not match', ErrorCode.PASSWORD_DID_NOT_MATCH)
    }
    await this.userService.softDeleteUserById((context.user as User).id)
    await this.authService.logout(context.req.cookies['token'])

    await this.notificationService.createUserLogs(user, context, 'Deleted user account', true)
  }

  async updateBilling(billingInput: BillingInput, context: MyContext): Promise<User> {
    const user = await this.userService.updateUserById((context.user as User).id, {
      billing: {
        address1: billingInput.address1 || '',
        address2: billingInput.address2 || '',
        city: billingInput.city || '',
        country: billingInput.country || '',
        name: billingInput.name || '',
        phone: billingInput.phone || '',
        state: billingInput.state || '',
        type: billingInput.type || BillingType.Personal,
        zip: billingInput.zip || '',
      },
    })

    await this.notificationService.createUserLogs(user, context, 'Updated user billing info', true)
    return user
  }

  async updateCurrentBiolink(biolinkId: string, context: MyContext): Promise<User> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    const user = await this.userService.updateUserById((context.user as User).id, {
      currentBiolinkId: biolinkId,
    })
    return user
  }

  async getNotification(
    connectionArgs: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedUserLogResponse> {
    return await this.notificationService.getNotification((context.user as User).id, connectionArgs)
  }
}
