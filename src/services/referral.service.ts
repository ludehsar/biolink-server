import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ConnectionArgs } from '../input-types'
import { PaginatedReferralResponse } from '../object-types/common/PaginatedReferralResponse'
import { Referral, User } from '../entities'
import { ReferralUpdateBody } from 'interfaces/ReferralUpdateBody'
import { PaginatedUserResponse } from 'object-types/common/PaginatedUserResponse'

@Service()
export class ReferralService {
  constructor(
    @InjectRepository(Referral) private readonly referralRepository: Repository<Referral>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  /**
   * Get all sent email referrals
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedReferralResponse>}
   */
  async getAllSentEmailReferrals(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedReferralResponse> {
    const queryBuilder = this.referralRepository
      .createQueryBuilder('referral')
      .where(`referral.referredById = :userId`, { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(referral.referredByEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(referral.referredByName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(referral.referredToEmail) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(referral.referredToName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Referral,
      alias: 'referral',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Get users with used referral codes paginated
   * @param {string} referrerId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedUserResponse>}
   */
  async getUsersRegisteredWithReferralCodes(
    referrerId: string,
    options: ConnectionArgs
  ): Promise<PaginatedUserResponse> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.registeredByCode', 'code')
      .where('code.referrerId = :userId', { userId: referrerId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          }).orWhere(`LOWER(user.country) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
        })
      )

    const paginator = buildPaginator({
      entity: User,
      alias: 'user',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Create referral code
   * @param {User} user
   * @param {ReferralUpdateBody} updateBody
   * @returns {Promise<Referral[]>}
   */
  async createReferralCode(user: User, updateBody: ReferralUpdateBody): Promise<Referral[]> {
    const referralsEntity = this.referralRepository.create(
      updateBody.userInfo?.map((referredTo) => ({
        referredBy: user,
        referredByEmail: updateBody.referredByEmail,
        referredByName: updateBody.referredByName,
        referredToEmail: referredTo.referredToEmail,
        referredToName: referredTo.referredToName,
      }))
    )

    await this.referralRepository.insert(referralsEntity)

    return referralsEntity
  }
}
