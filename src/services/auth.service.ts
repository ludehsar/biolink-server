import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-errors'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Service } from 'typedi'
import * as argon2 from 'argon2'

import { User, Token } from '../entities'
import { UserService } from './user.service'
import { TokenService } from './token.service'
import { Repository } from 'typeorm'
import { TokenType } from 'enums'
import { ErrorCode } from 'types'
import { Response } from 'express'
import { AccessAndRefreshToken } from 'object-types/auth/AccessAndRefreshToken'

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
   * Logout
   * @param {string} refreshToken
   * @returns {Promise<User>}
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
   * @returns {Promise<{ access: AuthToken; refresh: AuthToken }>}
   */
  async refreshAuth(refreshToken: string, res: Response): Promise<AccessAndRefreshToken> {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, TokenType.Refresh)
      const user = await refreshTokenDoc.user

      if (!user) {
        throw new ApolloError('Invalid token', ErrorCode.INVALID_TOKEN)
      }

      await refreshTokenDoc.remove()

      return this.tokenService.generateAuthTokens(user, res)
    } catch (error) {
      throw new AuthenticationError('User not authenticated')
    }
  }
}
