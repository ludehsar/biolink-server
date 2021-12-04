import * as jwt from 'jsonwebtoken'
import { Service } from 'typedi'
import moment, { Moment } from 'moment'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'

import { appConfig, cookieConfig } from '../config'
import { Token, User } from '../entities'
import { ErrorCode } from '../types'
import { TokenType } from '../enums'
import { UserService } from './user.service'
import { AccessAndRefreshToken } from '../object-types/auth/AccessAndRefreshToken'
import { Response } from 'express'

@Service()
export class TokenService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService
  ) {}

  /**
   * Generates token
   * @param {string} userId
   * @param {Moment} expires
   * @param {TokenType} type
   * @param {string} [secret=appConfig.accessTokenSecret]
   * @returns {string}
   */
  generateToken(
    userId: string,
    expires: Moment,
    type: TokenType,
    secret = appConfig.accessTokenSecret
  ): string {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    }

    return jwt.sign(payload, secret)
  }

  /**
   * Save a token
   * @param {string} token
   * @param {User} user
   * @param {Moment} expires
   * @param {TokenType} type
   * @param {boolean} [blacklisted = false]
   * @returns {Promise<Token>}
   */
  async saveToken(
    token: string,
    user: User,
    expires: Moment,
    type: TokenType,
    blacklisted = false
  ): Promise<Token> {
    const tokenDoc = this.tokenRepository.create({
      token,
      expires,
      type,
      blacklisted,
    })
    tokenDoc.user = Promise.resolve(user)
    await tokenDoc.save()

    return tokenDoc
  }

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {TokenType} type
   * @returns {Promise<Token>}
   */
  async verifyToken(token: string, type: TokenType): Promise<Token> {
    let secret = ''

    switch (type) {
      case TokenType.Access:
        secret = appConfig.accessTokenSecret
        break
      case TokenType.EmailVerification:
        secret = appConfig.emailVerificationTokenSecret
        break
      case TokenType.ResetPassword:
        secret = appConfig.forgotPasswordTokenSecret
        break
      case TokenType.Refresh:
        secret = appConfig.refreshTokenSecret
        break
      default:
        throw new ApolloError('Invalid token type', ErrorCode.INVALID_TOKEN)
    }

    const payload = jwt.verify(token, secret)
    const user = await this.userService.getUserById(payload.sub as string)

    const tokenDoc = await this.tokenRepository.findOne({
      token,
      type,
      user: Promise.resolve(user),
      blacklisted: false,
    })

    if (!tokenDoc) {
      throw new ApolloError('Token not found', ErrorCode.INVALID_TOKEN)
    }

    return tokenDoc
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<AccessAndRefreshToken>}
   */
  async generateAuthTokens(user: User, res: Response): Promise<AccessAndRefreshToken> {
    const accessTokenExpires = moment().add(appConfig.accessTokenExpirationHours, 'hours')
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      TokenType.Access,
      appConfig.accessTokenSecret
    )

    const refreshTokenExpires = moment().add(appConfig.refreshTokenExpirationDays, 'days')
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      TokenType.Refresh,
      appConfig.refreshTokenSecret
    )
    await this.saveToken(refreshToken, user, refreshTokenExpires, TokenType.Refresh)
    res.cookie('token', refreshToken, cookieConfig.refreshTokenCookieOptions)

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.unix(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.unix(),
      },
    }
  }

  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email)

    const expires = moment().add(appConfig.forgotPasswordTokenExpirationMinutes, 'minutes')
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      TokenType.ResetPassword,
      appConfig.forgotPasswordTokenSecret
    )
    await this.saveToken(resetPasswordToken, user, expires, TokenType.ResetPassword)
    return resetPasswordToken
  }

  /**
   * Generate verify email token
   * @param {User} user
   * @returns {Promise<string>}
   */
  async generateVerifyEmailToken(user: User): Promise<string> {
    const expires = moment().add(appConfig.emailVerificationTokenExpirationDays, 'days')
    const verifyEmailToken = this.generateToken(
      user.id,
      expires,
      TokenType.EmailVerification,
      appConfig.emailVerificationTokenSecret
    )
    await this.saveToken(verifyEmailToken, user, expires, TokenType.EmailVerification)
    return verifyEmailToken
  }
}
