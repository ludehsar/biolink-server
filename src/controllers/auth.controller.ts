import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import moment from 'moment'
import * as argon2 from 'argon2'
import * as randToken from 'rand-token'

import { UserWithTokens } from '../object-types'
import { LoginInput, RegisterInput } from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { TokenService } from '../services/token.service'
import { BlacklistType, CodeType, PremiumUsernameType, SocialAccountStyleType } from '../enums'
import { AuthService } from '../services/auth.service'
import { AccessAndRefreshToken } from '../object-types/auth/AccessAndRefreshToken'
import { EmailService } from '../services/email.service'
import { Biolink, BlackList, Code, Plan, User, Username } from '../entities'
import { stripe } from '../utilities'

@Service()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Username) private readonly usernameRepository: Repository<Username>,
    @InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>,
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>
  ) {}

  async register(registerInput: RegisterInput, context: MyContext): Promise<UserWithTokens> {
    let usernameDocWithUsername = await this.usernameRepository.findOne({
      where: {
        username: registerInput.username,
      },
    })
    if (
      usernameDocWithUsername &&
      (usernameDocWithUsername.biolinkId ||
        (usernameDocWithUsername.expireDate !== null &&
          moment(moment.now()).isBefore(moment(usernameDocWithUsername.expireDate))) ||
        usernameDocWithUsername.username.startsWith('0'))
    ) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    } else if (
      usernameDocWithUsername &&
      usernameDocWithUsername.premiumType !== PremiumUsernameType.None
    ) {
      throw new ApolloError('Cannot take this username', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const userDocWithEmail = await this.userRepository.findOne({
      where: {
        email: registerInput.email,
      },
    })
    if (userDocWithEmail) {
      throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
    }

    const blackListedEntity = await this.blackListRepository.findOne({
      where: [
        {
          keyword: registerInput.email,
          blacklistType: BlacklistType.Email,
        },
        {
          keyword: registerInput.username,
          blacklistType: BlacklistType.Username,
        },
      ],
    })
    if (blackListedEntity) {
      throw new ApolloError('This request cannot be processed', ErrorCode.EMAIL_BLACKLISTED)
    }

    const encryptedPassword = await argon2.hash(registerInput.password)

    const user = this.userRepository.create({
      email: registerInput.email,
      encryptedPassword,
      totalLogin: 1,
    })

    if (registerInput.referralToken) {
      const code = await this.codeRepository.findOne({
        where: {
          code: registerInput.referralToken,
        },
      })

      if (code) user.registeredByCode = Promise.resolve(code)
    }

    const freePlan = await this.planRepository.findOne({
      where: {
        name: 'Free',
      },
    })
    if (freePlan) {
      user.plan = freePlan
    }

    await user.save()

    const code = this.codeRepository.create({
      code: randToken.generate(10),
      discount: 20,
      quantity: -1,
      type: CodeType.Referral,
    })
    code.referrer = Promise.resolve(user)
    await code.save()
    await stripe.coupons.create({
      id: code.code,
      percent_off: code.discount,
      duration: 'once',
    })

    if (!usernameDocWithUsername) {
      usernameDocWithUsername = await this.usernameRepository
        .create({
          username: registerInput.username,
        })
        .save()
    }

    const biolink = this.biolinkRepository.create({
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
    biolink.user = Promise.resolve(user)
    biolink.username = Promise.resolve(usernameDocWithUsername)
    await biolink.save()

    usernameDocWithUsername.biolink = Promise.resolve(biolink)
    usernameDocWithUsername.owner = Promise.resolve(user)
    usernameDocWithUsername.expireDate = null
    await usernameDocWithUsername.save()

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
