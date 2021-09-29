import { ApolloError } from 'apollo-server-errors'
import * as argon2 from 'argon2'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { User } from '../entities'
import { BlackListService } from './blacklist.service'
import { BlacklistType } from '../enums'
import { CodeService } from './code.service'
import { PlanService } from './plan.service'
import { UserUpdateBody } from '../interfaces/UserUpdateBody'

@Service()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly blacklistService: BlackListService,
    private readonly codeService: CodeService,
    private readonly planService: PlanService
  ) {}

  /**
   * Create a user
   * @param {string} email
   * @param {string} password
   * @param {string} [referralToken]
   * @returns {Promise<User>}
   */
  async createUser(email: string, password: string, referralToken?: string): Promise<User> {
    if (await this.isEmailTaken(email)) {
      throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
    }

    if (await this.blacklistService.isKeywordBlacklisted(email, BlacklistType.Email)) {
      throw new ApolloError('Email is blacklisted', ErrorCode.EMAIL_BLACKLISTED)
    }

    const encryptedPassword = await argon2.hash(password)
    const user = this.userRepository.create({
      email,
      encryptedPassword,
    })

    if (referralToken) {
      const code = this.codeService.getCodeDoc(referralToken)

      if (code) {
        user.registeredByCode = Promise.resolve(code)
      }
    }

    const freePlan = await this.planService.getFreePlan()
    user.plan = Promise.resolve(freePlan)

    await user.save()

    await this.codeService.createReferralCode(user)

    return user
  }

  /**
   * Is Email Verified
   * @param {string} email
   * @param {string} [excludedId]
   * @returns {Promise<boolean>}
   */
  async isEmailTaken(email: string, excludedId?: string): Promise<boolean> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })

    if (excludedId) {
      qb.andWhere('user.id != :excludedId', { excludedId })
    }

    const user = await qb.getOne()

    return !!user
  }

  /**
   * Get user
   * @param {string} userId
   * @returns {Promise<User>}
   */
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new ApolloError('Invalid user id', ErrorCode.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Change user info by user id
   * @param {string} userId
   * @param {UserUpdateBody} updateBody
   * @returns {Promise<User>}
   */
  async updateUserById(userId: string, updateBody: UserUpdateBody): Promise<User> {
    const user = await this.getUserById(userId)

    if (!user) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if (updateBody.adminRole) user.adminRole = Promise.resolve(updateBody.adminRole)
    else if (updateBody.adminRole === null) user.adminRole = null
    if (updateBody.authenticatorSecret) user.authenticatorSecret = updateBody.authenticatorSecret
    if (updateBody.billing) user.billing = updateBody.billing
    if (updateBody.country) user.country = updateBody.country
    if (updateBody.currentBiolinkId) user.currentBiolinkId = updateBody.currentBiolinkId
    if (updateBody.email) {
      if (await this.isEmailTaken(updateBody.email, userId)) {
        throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
      }
      if (user.email !== updateBody.email) {
        user.emailVerifiedAt = null
      }
      user.email = updateBody.email
    }
    if (updateBody.emailVerifiedAt) user.emailVerifiedAt = updateBody.emailVerifiedAt
    if (updateBody.password) {
      user.encryptedPassword = await argon2.hash(updateBody.password)
    }
    if (updateBody.facebookId) user.facebookId = updateBody.facebookId
    if (updateBody.language) user.language = updateBody.language
    if (updateBody.lastActiveTill) user.lastActiveTill = updateBody.lastActiveTill
    if (updateBody.lastIPAddress) user.lastIPAddress = updateBody.lastIPAddress
    if (updateBody.lastUserAgent) user.lastUserAgent = updateBody.lastUserAgent
    if (updateBody.plan) user.plan = Promise.resolve(updateBody.plan)
    if (updateBody.planExpirationDate) user.planExpirationDate = updateBody.planExpirationDate
    if (updateBody.planTrialDone) user.planTrialDone = updateBody.planTrialDone
    if (updateBody.planType) user.planType = updateBody.planType
    if (updateBody.registeredByCode)
      user.registeredByCode = Promise.resolve(updateBody.registeredByCode)
    else if (updateBody.registeredByCode === null) user.registeredByCode = null
    if (updateBody.stripeCustomerId) user.stripeCustomerId = updateBody.stripeCustomerId
    if (updateBody.timezone) user.timezone = updateBody.timezone
    if (updateBody.totalLogin) user.totalLogin = updateBody.totalLogin

    await user.save()
    return user
  }
}
