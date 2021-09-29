import { ApolloError } from 'apollo-server-errors'
import moment from 'moment'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Username } from '../entities'
import { PremiumUsernameType } from '../enums'
import { UsernameUpdateBody } from '../interfaces/UsernameUpdateBody'

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
          moment(moment.now()).isBefore(moment(usernameDoc.expireDate))) ||
        username.startsWith('0')
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
   * @param {string} username
   * @returns {Promise<Username>}
   */
  async createUsername(username: string): Promise<Username> {
    if (await this.isUsernameTaken(username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const usernameDoc = this.usernameRepository.create({
      username,
    })
    await usernameDoc.save()

    return usernameDoc
  }

  /**
   * Find or create a username
   * @param {string} username
   * @returns {Promise<Username>}
   */
  async findOneOrCreate(username: string): Promise<Username> {
    let usernameDoc = await this.usernameRepository.findOne({
      username,
    })

    if (await this.isUsernameTaken(username)) {
      throw new ApolloError('Username already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    if (!usernameDoc) {
      usernameDoc = await this.createUsername(username)
    }

    return usernameDoc
  }

  /**
   * Update username by id
   * @param {string} usernameId
   * @param {UsernameUpdateBody} updateBody
   * @returns {Promise<Username>}
   */
  async updateUsernameById(usernameId: string, updateBody: UsernameUpdateBody): Promise<Username> {
    const username = await this.usernameRepository.findOne(usernameId)

    if (!username) {
      throw new ApolloError('No username found', ErrorCode.USERNAME_NOT_FOUND)
    }

    if (updateBody.biolink) username.biolink = Promise.resolve(updateBody.biolink)
    else if (updateBody.biolink === null) username.biolink = null
    if (updateBody.expireDate) username.expireDate = updateBody.expireDate
    if (updateBody.owner) username.owner = Promise.resolve(updateBody.owner)
    else if (updateBody.owner === null) username.owner = null
    if (updateBody.premiumType) username.premiumType = updateBody.premiumType

    await username.save()

    return username
  }
}
