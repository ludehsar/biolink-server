import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as argon2 from 'argon2'

import { Biolink } from '../entities'
import { UsernameService } from './username.service'
import { ErrorCode } from '../types'
import { BiolinkUpdateBody } from '../interfaces/BiolinkUpdateBody'
import { ConnectionArgs } from '../input-types'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'
import { buildPaginator } from 'typeorm-cursor-pagination'

@Service()
export class BiolinkService {
  constructor(
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    private readonly usernameService: UsernameService
  ) {}

  /**
   * Create a biolink
   * @param {BiolinkUpdateBody} updateBody
   * @returns {Promise<Biolink>}
   */
  async createBiolink(updateBody: BiolinkUpdateBody): Promise<Biolink> {
    let biolink = await this.biolinkRepository.create().save()

    biolink = await this.updateBiolinkById(biolink.id, updateBody)

    return biolink
  }

  /**
   * Get biolink by Id
   * @param {string} biolinkId
   * @returns {Promise<Biolink>}
   */
  async getBiolinkById(biolinkId: string): Promise<Biolink> {
    const biolink = await this.biolinkRepository.findOne(biolinkId)

    if (!biolink) {
      throw new ApolloError('Invalid biolink id', ErrorCode.BIOLINK_COULD_NOT_BE_FOUND)
    }

    return biolink
  }

  /**
   * Get biolink by username
   * @param {string} username
   * @returns {Promise<Biolink>}
   */
  async getBiolinkByUsername(username: string): Promise<Biolink> {
    const usernameDoc = await this.usernameService.getUsernameDocByUsername(username)
    const biolink = await usernameDoc.biolink

    if (!biolink) {
      throw new ApolloError('Invalid username', ErrorCode.BIOLINK_COULD_NOT_BE_FOUND)
    }

    return biolink
  }

  /**
   * Check if password matched
   * @param {Biolink} biolink
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatched(biolink: Biolink, password: string): Promise<boolean> {
    if (await argon2.verify((biolink.settings || {}).password || '', password)) {
      return true
    }

    return false
  }

  /**
   * Count number of biolinks by user id
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countBiolinksByUserId(userId: string): Promise<number> {
    return await this.biolinkRepository
      .createQueryBuilder('biolink')
      .where('biolink.userId = :userId', { userId: userId })
      .getCount()
  }

  /**
   * Update biolink by biolink id
   * @param {string} biolinkId
   * @param {BiolinkUpdateBody} updateBody
   * @returns {Promise<Biolink>}
   */
  async updateBiolinkById(biolinkId: string, updateBody: BiolinkUpdateBody): Promise<Biolink> {
    const biolink = await this.getBiolinkById(biolinkId)

    if (!biolink) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if (updateBody.bio) biolink.bio = updateBody.bio
    if (updateBody.category) {
      biolink.category = Promise.resolve(updateBody.category)
    }
    if (updateBody.changedUsername) biolink.changedUsername = updateBody.changedUsername
    if (updateBody.city) biolink.city = updateBody.city
    if (updateBody.country) biolink.country = updateBody.country
    if (updateBody.coverPhoto) {
      // TODO: Upload photo in aws s3
    }
    if (updateBody.displayName) biolink.displayName = updateBody.displayName
    if (updateBody.featured) biolink.featured = updateBody.featured
    if (updateBody.latitude) biolink.latitude = updateBody.latitude
    if (updateBody.longitude) biolink.longitude = updateBody.longitude
    if (updateBody.profilePhoto) {
      // TODO: Upload photo in aws s3
    }
    if (updateBody.settings) biolink.settings = updateBody.settings
    if (updateBody.state) biolink.state = updateBody.state
    if (updateBody.user) biolink.user = Promise.resolve(updateBody.user)
    if (updateBody.username) {
      const oldUsername = await biolink.username

      if (oldUsername && oldUsername.id !== updateBody.username.id) {
        await this.usernameService.updateUsernameById(oldUsername.id, {
          biolink: null,
          expireDate: new Date(Date.now() + 12096e5),
        })

        biolink.changedUsername = true
      }

      biolink.username = Promise.resolve(updateBody.username)
      await this.usernameService.updateUsernameById(updateBody.username.id, {
        biolink,
        owner: await biolink.user,
        expireDate: null,
      })
    }
    if (updateBody.verification) {
      biolink.verification = Promise.resolve(updateBody.verification)
    }
    if (updateBody.verificationStatus) biolink.verificationStatus = updateBody.verificationStatus
    if (updateBody.verifiedEmail) biolink.verifiedEmail = updateBody.verifiedEmail
    if (updateBody.verifiedGovernmentId)
      biolink.verifiedGovernmentId = updateBody.verifiedGovernmentId
    if (updateBody.verifiedPhoneNumber) biolink.verifiedPhoneNumber = updateBody.verifiedPhoneNumber
    if (updateBody.verifiedWorkEmail) biolink.verifiedWorkEmail = updateBody.verifiedWorkEmail

    await biolink.save()
    return biolink
  }

  /**
   * Get all user biolinks
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedBiolinkResponse>}
   */
  async getAllBiolinksByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedBiolinkResponse> {
    const queryBuilder = this.biolinkRepository
      .createQueryBuilder('biolink')
      .leftJoinAndSelect('biolink.category', 'category')
      .leftJoinAndSelect('biolink.username', 'username')
      .where(`biolink.userId = :userId`, {
        userId: userId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(username.username) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(biolink.displayName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(biolink.city) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(biolink.state) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(biolink.country) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(biolink.bio) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(category.categoryName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Biolink,
      alias: 'biolink',
      paginationKeys: ['createdAt'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }
}
