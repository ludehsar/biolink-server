import { ApolloError } from 'apollo-server-errors'
import moment from 'moment'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Biolink, User, Username } from '../entities'
import { PremiumUsernameType } from '../enums'

@Service()
export class UsernameService {
  constructor(
    @InjectRepository(Username) private readonly usernameRepository: Repository<Username>
  ) {}

  /**
   * Checks if the username is taken
   * @param {string} username
   * @param {string} [excludedUserId]
   * @returns {Promise<boolean>}
   */
  async isUsernameTaken(username: string, excludedUserId?: string): Promise<boolean> {
    const qb = this.usernameRepository
      .createQueryBuilder('username')
      .where('username.username = :username', { username })

    if (excludedUserId) {
      qb.andWhere('username.ownerId != :excludedUserId', { excludedUserId })
    }

    const usernameDoc = await qb.getOne()

    if (usernameDoc) {
      if (
        usernameDoc.biolinkId ||
        (usernameDoc.expireDate !== null &&
          moment(moment.now()).isBefore(moment(usernameDoc.expireDate)))
      ) {
        return true
      }
    }

    return false
  }

  /**
   * Checks if the username is premium
   * @param {string} username
   * @param {string} [excludedUserId]
   * @returns {Promise<boolean>}
   */
  async isPremiumUsername(username: string, excludedUserId?: string): Promise<boolean> {
    const qb = this.usernameRepository
      .createQueryBuilder('premium')
      .where('premium.username = :username and premium.premiumType != :premiumType', {
        username,
        premiumType: PremiumUsernameType.None,
      })
    if (excludedUserId) {
      qb.andWhere('premium.ownerId != :excludedUserId', { excludedUserId })
    }

    const usernameDoc = await qb.getOne()

    return !!usernameDoc
  }

  /**
   * Create a username
   * @param {User} user
   * @param {string} username
   * @returns {Promise<Username>}
   */
  async createUsername(user: User, username: string): Promise<Username> {
    if (await this.isUsernameTaken(username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const usernameDoc = this.usernameRepository.create({
      username,
    })
    usernameDoc.owner = Promise.resolve(user)
    await usernameDoc.save()

    return usernameDoc
  }

  /**
   * Find or create a username
   * @param {User} user
   * @param {string} username
   * @returns {Promise<Username>}
   */
  async findOneOrCreate(user: User, username: string): Promise<Username> {
    if (await this.isUsernameTaken(username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    let usernameDoc = await this.usernameRepository.findOne({
      username,
    })

    if (!usernameDoc) {
      usernameDoc = this.usernameRepository.create({
        username,
      })
      usernameDoc.owner = Promise.resolve(user)
      await usernameDoc.save()
    }

    return usernameDoc
  }

  /**
   * Links username with biolink
   * @param {Username} username
   * @param {Biolink} biolink
   * @returns {Promise<Username>}
   */
  async linkBiolink(username: Username, biolink: Biolink): Promise<Username> {
    username.biolink = Promise.resolve(biolink)
    username.owner = Promise.resolve(await biolink.user)
    await username.save()

    return username
  }
}
