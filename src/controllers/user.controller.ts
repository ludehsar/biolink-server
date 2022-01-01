import { ApolloError, ForbiddenError } from 'apollo-server-errors'
import { Service } from 'typedi'
import * as randToken from 'rand-token'
import { MailDataRequired } from '@sendgrid/mail'

import { UserService } from '../services/user.service'
import {
  BillingInput,
  ChangePasswordInput,
  ConnectionArgs,
  EmailAndUsernameInput,
  NewUserInput,
  PasswordInput,
} from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { Biolink, Code, Link, Payment, User } from '../entities'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { AuthService } from '../services/auth.service'
import { BillingType, BlacklistType } from '../enums'
import { NotificationService } from '../services/notification.service'
import { PaginatedUserLogResponse, UserTotalCountsResponse } from '../object-types'
import { PaginatedUserResponse } from '../object-types/common/PaginatedUserResponse'
import { AdminRoleService } from '../services/admin-role.service'
import { PlanService } from '../services/plan.service'
import { CodeService } from '../services/code.service'
import { sgMail } from '../utilities'
import { BlackListService } from '../services/blacklist.service'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

@Service()
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly biolinkService: BiolinkService,
    private readonly usernameService: UsernameService,
    private readonly notificationService: NotificationService,
    private readonly roleService: AdminRoleService,
    private readonly planService: PlanService,
    private readonly codeService: CodeService,
    private readonly blacklistService: BlackListService,
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>
  ) {}

  async getAllUsers(options: ConnectionArgs): Promise<PaginatedUserResponse> {
    return await this.userService.getAllUsers(options)
  }

  async getAllAdmins(options: ConnectionArgs): Promise<PaginatedUserResponse> {
    return await this.userService.getAllUsers(options, true)
  }

  async getUserByAdmins(userId: string): Promise<User> {
    return await this.userService.getUserById(userId)
  }

  async createUserByAdmins(input: NewUserInput): Promise<User> {
    if (input.email) {
      if (await this.userService.isEmailTaken(input.email)) {
        throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
      }
      if (await this.blacklistService.isKeywordBlacklisted(input.email, BlacklistType.Email)) {
        throw new ApolloError('Email is blacklisted', ErrorCode.EMAIL_BLACKLISTED)
      }
    }

    let adminRole = undefined
    if (input.adminRoleId) {
      adminRole = await this.roleService.getRoleById(input.adminRoleId)
    }

    let plan = undefined
    if (input.planId) {
      plan = await this.planService.getPlanByPlanId(input.planId)
    }

    let registeredByCode = undefined
    if (input.registeredByCodeId) {
      registeredByCode = await this.codeService.getCodeByCodeId(input.registeredByCodeId)
    }

    const password = randToken.generate(18)

    const user = await this.userService.createUser({
      adminRole,
      billing: {
        address1: input.address1,
        address2: input.address2,
        city: input.city,
        country: input.country,
        name: input.name,
        phone: input.phone,
        state: input.state,
        type: input.billingType,
        zip: input.zip,
      },
      country: input.country,
      email: input.email,
      name: input.name,
      password,
      plan,
      planExpirationDate: input.planExpirationDate,
      planTrialDone: input.planTrialDone,
      planType: input.planType,
      registeredByCode,
      usedReferralsToPurchasePlan: input.usedReferralsToPurchasePlan,
    })

    const newAccountConfirmationEmail: MailDataRequired = {
      to: user.email,
      from: {
        name: 'Stashee Support',
        email: 'info@stash.ee',
      },
      subject: `Login into your account to grab your account`,
      text: `An account has been created with email: ${user.email} and password: ${password}. Please login to grab your username`,
      html: `An account has been created with email: ${user.email} and password: ${password}. Please login to grab your username`,
    }

    await sgMail.send(newAccountConfirmationEmail)

    return user
  }

  async updateUserByAdmins(userId: string, input: NewUserInput): Promise<User> {
    if (input.email) {
      if (await this.userService.isEmailTaken(input.email, userId)) {
        throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
      }
      if (await this.blacklistService.isKeywordBlacklisted(input.email, BlacklistType.Email)) {
        throw new ApolloError('Email is blacklisted', ErrorCode.EMAIL_BLACKLISTED)
      }
    }

    let adminRole = undefined
    if (input.adminRoleId) {
      adminRole = await this.roleService.getRoleById(input.adminRoleId)
    }

    let plan = undefined
    if (input.planId) {
      plan = await this.planService.getPlanByPlanId(input.planId)
    }

    let registeredByCode = undefined
    if (input.registeredByCodeId) {
      registeredByCode = await this.codeService.getCodeByCodeId(input.registeredByCodeId)
    }

    return await this.userService.updateUserById(userId, {
      adminRole,
      billing: {
        address1: input.address1,
        address2: input.address2,
        city: input.city,
        country: input.country,
        name: input.name,
        phone: input.phone,
        state: input.state,
        type: input.billingType,
        zip: input.zip,
      },
      country: input.country,
      email: input.email,
      name: input.name,
      plan,
      planExpirationDate: input.planExpirationDate,
      planTrialDone: input.planTrialDone,
      planType: input.planType,
      registeredByCode,
      usedReferralsToPurchasePlan: input.usedReferralsToPurchasePlan,
    })
  }

  async deleteUserByAdmins(userId: string): Promise<User> {
    return await this.userService.softDeleteUserById(userId)
  }

  async getUserSummaryCounts(userId: string): Promise<UserTotalCountsResponse> {
    const user = await this.userService.getUserById(userId)

    const totalBiolinks = await this.biolinkRepository.count({ where: { user } })
    const totalShortenedLinks = await this.linkRepository.count({ where: { user } })
    const totalReferralCodes = await this.codeRepository.count({ where: { referrer: user } })
    const { totalPayed } = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.userId = :userId', { userId: user.id })
      .select('SUM(payment.stripeAmountPaid)', 'totalPayed')
      .getRawOne()

    return {
      totalBiolinks,
      totalReferralCodes,
      totalShortenedLinks,
      totalPayed,
    }
  }

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

  async getUserReferralToken(context: MyContext): Promise<Code> {
    return await this.userService.getReferralTokenByUserId((context.user as User).id)
  }
}
