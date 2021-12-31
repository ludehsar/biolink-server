import { ApolloError } from 'apollo-server-errors'
import * as argon2 from 'argon2'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Code, User } from '../entities'
import { UserUpdateBody } from '../interfaces/UserUpdateBody'
import { CodeType } from '../enums'
import { stripe } from '../utilities'

@Service()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>
  ) {}

  /**
   * Create a user
   * @param {UserUpdateBody} updateBody
   * @returns {Promise<User>}
   */
  async createUser(updateBody: UserUpdateBody): Promise<User> {
    let user = await this.userRepository.create().save()

    user = await this.updateUserById(user.id, updateBody)

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
   * Get user by stripe customer id
   * @param {string} stripeCustomerId
   * @returns {Promise<User>}
   */
  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        stripeCustomerId,
      },
    })

    if (!user) {
      throw new ApolloError('Invalid stripe customer id', ErrorCode.USER_NOT_FOUND)
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

    if (updateBody.adminRole !== undefined) user.adminRole = Promise.resolve(updateBody.adminRole)
    if (updateBody.authenticatorSecret !== undefined)
      user.authenticatorSecret = updateBody.authenticatorSecret
    if (updateBody.billing !== undefined) user.billing = updateBody.billing
    if (updateBody.country !== undefined) user.country = updateBody.country
    if (updateBody.currentBiolinkId !== undefined)
      user.currentBiolinkId = updateBody.currentBiolinkId
    if (updateBody.email !== undefined) {
      if (await this.isEmailTaken(updateBody.email, userId)) {
        throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
      }
      if (user.email !== updateBody.email) {
        user.emailVerifiedAt = null
      }
      user.email = updateBody.email
    }
    if (updateBody.emailVerifiedAt !== undefined) user.emailVerifiedAt = updateBody.emailVerifiedAt
    if (updateBody.password !== undefined) {
      user.encryptedPassword = await argon2.hash(updateBody.password)
    }
    if (updateBody.facebookId !== undefined) user.facebookId = updateBody.facebookId
    if (updateBody.language !== undefined) user.language = updateBody.language
    if (updateBody.lastActiveTill !== undefined) user.lastActiveTill = updateBody.lastActiveTill
    if (updateBody.lastIPAddress !== undefined) user.lastIPAddress = updateBody.lastIPAddress
    if (updateBody.lastUserAgent !== undefined) user.lastUserAgent = updateBody.lastUserAgent
    if (updateBody.plan !== undefined) user.plan = Promise.resolve(updateBody.plan)
    if (updateBody.planExpirationDate !== undefined)
      user.planExpirationDate = updateBody.planExpirationDate
    if (updateBody.planTrialDone !== undefined) user.planTrialDone = updateBody.planTrialDone
    if (updateBody.planType !== undefined) user.planType = updateBody.planType
    if (updateBody.registeredByCode !== undefined)
      user.registeredByCode = Promise.resolve(updateBody.registeredByCode)
    else if ((updateBody.registeredByCode === null) !== undefined) user.registeredByCode = null
    if (updateBody.stripeCustomerId !== undefined)
      user.stripeCustomerId = updateBody.stripeCustomerId
    if (updateBody.timezone !== undefined) user.timezone = updateBody.timezone
    if (updateBody.totalLogin !== undefined) user.totalLogin = updateBody.totalLogin
    if (updateBody.usedReferralsToPurchasePlan !== undefined)
      user.usedReferralsToPurchasePlan = updateBody.usedReferralsToPurchasePlan
    if (updateBody.availableBalance !== undefined)
      user.availableBalance = updateBody.availableBalance

    await user.save()
    return user
  }

  /**
   * Delete user by Id
   * @param {string} userId
   * @returns {Promise<User>}
   */
  async softDeleteUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new ApolloError('Invalid user id', ErrorCode.USER_NOT_FOUND)
    }

    await user.softRemove()

    // When removing user account, also delete all the subscriptions
    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 100,
        status: 'active',
      })
      subscriptions.data.forEach(async (subscription) => {
        await stripe.subscriptions.del(subscription.id)
      })
    }

    return user
  }

  /**
   * Gets referral token by user id
   * @param {string} userId
   * @returns {Promise<Code>}
   */
  async getReferralTokenByUserId(userId: string): Promise<Code> {
    const user = await this.getUserById(userId)

    const referralToken = await this.codeRepository.findOne({
      where: {
        referrer: user,
        type: CodeType.Referral,
      },
    })

    if (!referralToken) {
      throw new ApolloError('No referral token found.', ErrorCode.CODE_NOT_FOUND)
    }

    return referralToken
  }
}
