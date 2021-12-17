import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { UserWithTokens } from '../object-types'
import { UserService } from '../services/user.service'
import { LoginInput, RegisterInput } from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { TokenService } from '../services/token.service'
import { BlackListService } from '../services/blacklist.service'
import { BlacklistType, SocialAccountStyleType } from '../enums'
import { AuthService } from '../services/auth.service'
import { AccessAndRefreshToken } from '../object-types/auth/AccessAndRefreshToken'
import { EmailService } from '../services/email.service'
import { User } from '../entities'
import { CodeService } from '../services/code.service'
import { PlanService } from '../services/plan.service'
import { NotificationService } from '../services/notification.service'
import moment from 'moment'

@Service()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly codeService: CodeService,
    private readonly planService: PlanService,
    private readonly biolinkService: BiolinkService,
    private readonly blackListService: BlackListService,
    private readonly usernameService: UsernameService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService
  ) {}

  async register(registerInput: RegisterInput, context: MyContext): Promise<UserWithTokens> {
    if (await this.usernameService.isUsernameTaken(registerInput.username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    if (await this.userService.isEmailTaken(registerInput.email)) {
      throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
    }

    if (
      await this.blackListService.isKeywordBlacklisted(
        registerInput.username,
        BlacklistType.Username
      )
    ) {
      throw new ApolloError('Username cannot be used', ErrorCode.USERNAME_BLACKLISTED)
    }

    if (
      await this.blackListService.isKeywordBlacklisted(registerInput.email, BlacklistType.Email)
    ) {
      throw new ApolloError('Email is blacklisted', ErrorCode.EMAIL_BLACKLISTED)
    }

    if (await this.usernameService.isPremiumUsername(registerInput.username)) {
      throw new ApolloError('Premium username cannot be used', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    let code = undefined
    if (registerInput.referralToken) {
      code = await this.codeService.getCodeByReferralCode(registerInput.referralToken)
    }

    const freePlan = await this.planService.getFreePlan()

    const user = await this.userService.createUser({
      email: registerInput.email,
      password: registerInput.password,
      registeredByCode: code,
      plan: freePlan,
      totalLogin: 1,
    })

    await this.codeService.createReferralCode(user)

    const username = await this.usernameService.findAvailableOneOrCreate(registerInput.username)
    await this.biolinkService.createBiolink({
      user,
      username,
      settings: {
        addedToDirectory: false,
        blockSearchEngineIndexing: false,
        customBrandingName: '',
        customBrandingUrl: '',
        directoryBio: '',
        email: '',
        emailCaptureId: '',
        enableColoredContactButtons: false,
        enableColoredSocialMediaIcons: false,
        enableCustomBranding: false,
        enableDarkMode: false,
        enableEmailCapture: false,
        enableFacebookPixel: false,
        enableGoogleAnalytics: false,
        enablePasswordProtection: false,
        enableSensitiveContentWarning: false,
        enableUtmParameters: false,
        facebookPixelId: '',
        googleAnalyticsCode: '',
        metaDescription: '',
        opengraphImageUrl: '',
        pageTitle: '',
        password: '',
        payoneerLink: '',
        paypalLink: '',
        phone: '',
        removeDefaultBranding: false,
        showEmail: false,
        showPhone: false,
        socialAccountStyleType: SocialAccountStyleType.Round,
        utmCampaign: '',
        utmMedium: '',
        utmSource: '',
      },
    })

    const { access, refresh } = await this.tokenService.generateAuthTokens(user, context.res)

    context.user = user

    await this.sendVerificationEmail(context)

    return {
      access,
      refresh,
      user,
    }
  }

  async login(loginInput: LoginInput, context: MyContext): Promise<UserWithTokens> {
    const user = await this.authService.loginWithEmailAndPassword(
      loginInput.email,
      loginInput.password
    )
    const { access, refresh } = await this.tokenService.generateAuthTokens(user, context.res)

    await this.notificationService.createUserLogs(
      user,
      context,
      `User logged in at ${moment.now().toLocaleString()}`,
      true
    )

    return {
      access,
      refresh,
      user,
    }
  }

  async logout(context: MyContext): Promise<void> {
    await this.authService.logout(context.req.cookies['token'])
  }

  async refreshToken(context: MyContext): Promise<AccessAndRefreshToken> {
    return await this.authService.refreshAuth(context.req.cookies['token'], context.res)
  }

  async forgotPassword(email: string): Promise<void> {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(email)
    await this.emailService.sendResetPasswordEmail({ email }, resetPasswordToken)
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.authService.resetPassword(token, password)
  }

  async sendVerificationEmail(context: MyContext): Promise<void> {
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(context.user as User)
    await this.emailService.sendVerificationEmail(
      { email: (context.user as User).email },
      verifyEmailToken
    )
  }

  async verifyEmail(token: string): Promise<void> {
    await this.authService.verifyEmail(token)
  }
}
