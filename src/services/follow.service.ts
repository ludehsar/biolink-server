import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { Biolink, Follow, User } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'

@Service()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private readonly followRepository: Repository<Follow>,
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>
  ) {}

  /**
   * Follow a biolink
   * @param {User} user
   * @param {Biolink} biolink
   * @returns {Promise<Follow>}
   */
  async findOneOrFollow(user: User, biolink: Biolink): Promise<Follow> {
    let follow = await this.followRepository.findOne({
      where: {
        follower: user,
        followee: biolink,
      },
    })

    if (!follow) {
      follow = this.followRepository.create()

      follow.followee = Promise.resolve(biolink)
      follow.follower = Promise.resolve(user)

      await follow.save()
    }

    return follow
  }

  /**
   * Unfollow a biolink
   * @param {User} user
   * @param {Biolink} biolink
   * @returns {Promise<Follow>}
   */
  async unfollow(user: User, biolink: Biolink): Promise<Follow> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: user,
        followee: biolink,
      },
    })

    if (!follow) {
      throw new ApolloError(
        'The biolink is not followed by the user',
        ErrorCode.USER_NOT_FOLLOWING_THE_BIOLINK
      )
    }

    await follow.remove()

    return follow
  }

  /**
   * Get is the user is following biolink or not
   * @param {User} user
   * @param {Biolink} biolink
   * @returns {Promise<boolean>}
   */
  async isUserFollowingBiolink(user: User, biolink: Biolink): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: user,
        followee: biolink,
      },
    })

    if (!follow) {
      return false
    }

    return true
  }

  /**
   * Get all followed biolinks by user id
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedBiolinkResponse>}
   */
  async getFollowingBiolinksByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedBiolinkResponse> {
    const queryBuilder = this.biolinkRepository
      .createQueryBuilder('biolink')
      .leftJoinAndSelect('biolink.followees', 'follow')
      .leftJoinAndSelect('biolink.category', 'category')
      .leftJoinAndSelect('biolink.username', 'username')
      .where('follow.followerId = :userId', { userId: userId })
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
