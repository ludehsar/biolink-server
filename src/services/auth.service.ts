import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-errors'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Service } from 'typedi'
import * as argon2 from 'argon2'
import { Response } from 'express'
import { Repository } from 'typeorm'

import { User, Token } from '../entities'
import { UserService } from './user.service'
import { TokenService } from './token.service'
import { TokenType } from '../enums'
import { ErrorCode } from '../types'
import { AccessAndRefreshToken } from '../object-types/auth/AccessAndRefreshToken'

@Service()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
  ) {}

  /**
   * Login a user using email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async loginWithEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email)

    if (!user || !(await argon2.verify(user.encryptedPassword, password))) {
      throw new UserInputError('Incorrect email or password')
    }

    return user
  }

  /**
   * Check if password matched
   * @param {User} user
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatched(user: User, password: string): Promise<boolean> {
    if (await argon2.verify(user.encryptedPassword, password)) {
      return true
    }

    return false
  }

  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
  async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await this.tokenRepository.findOne({
      token: refreshToken,
      type: TokenType.Refresh,
      blacklisted: false,
    })

    if (!refreshTokenDoc) {
      throw new ApolloError('Invalid token', ErrorCode.INVALID_TOKEN)
    }

    await refreshTokenDoc.remove()
  }

  /**
   * Refresh auth token
   * @param {string} refreshToken
   * @param {Response} res
   * @returns {Promise<AccessAndRefreshToken>}
   */
  async refreshAuth(refreshToken: string, res: Response): Promise<AccessAndRefreshToken> {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, TokenType.Refresh)
      const user = await refreshTokenDoc.user

      if (!user) {
        throw new ApolloError('Invalid token', ErrorCode.INVALID_TOKEN)
      }

      await refreshTokenDoc.remove()

      return await this.tokenService.generateAuthTokens(user, res)
    } catch (error) {
      throw new AuthenticationError('User not authenticated')
    }
  }

  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  async resetPassword(
    resetPasswordToken: string,
    email: string,
    newPassword: string
  ): Promise<void> {
    try {
      const resetPasswordTokenDoc = await this.tokenService.verifyToken(
        resetPasswordToken,
        TokenType.ResetPassword
      )

      const user = await resetPasswordTokenDoc.user

      if (!user || user.email !== email) {
        throw new ApolloError('Invalid token', ErrorCode.INVALID_TOKEN)
      }

      await this.userService.updateUserById(user.id, { password: newPassword })
      await this.tokenRepository
        .createQueryBuilder('token')
        .delete()
        .where('"token"."userId" = :userId', { userId: user.id })
        .andWhere('"token"."type" = :type', { type: TokenType.ResetPassword })
        .execute()
    } catch (error) {
      throw new ApolloError('Password reset failed', ErrorCode.DATABASE_ERROR)
    }
  }

  /**
   * Verify email
   * @param {string} verifyEmailToken
   * @returns {Promise}
   */
  async verifyEmail(verifyEmailToken: string): Promise<void> {
    try {
      const verifyEmailTokenDoc = await this.tokenService.verifyToken(
        verifyEmailToken,
        TokenType.EmailVerification
      )

      const user = await verifyEmailTokenDoc.user

      if (!user) {
        throw new ApolloError('No user found', ErrorCode.USER_NOT_FOUND)
      }

      await this.tokenRepository
        .createQueryBuilder('token')
        .delete()
        .where('"token"."userId" = :userId', { userId: user.id })
        .andWhere('"token"."type" = :type', { type: TokenType.EmailVerification })
        .execute()

      await this.userService.updateUserById(user.id, { emailVerifiedAt: new Date() })
    } catch (error) {
      throw new ApolloError('Email verification failed', ErrorCode.USER_NOT_AUTHORIZED)
    }
  }
}
