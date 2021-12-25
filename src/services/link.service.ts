import { ApolloError } from 'apollo-server-express'
import moment from 'moment'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as argon2 from 'argon2'
import * as randToken from 'rand-token'

import { Link } from '../entities'
import { ErrorCode } from '../types'
import { LinkType } from '../enums'
import { ConnectionArgs } from '../input-types'
import { PaginatedLinkResponse } from '../object-types/common/PaginatedLinkResponse'
import { LinkUpdateBody } from '../interfaces/LinkUpdateBody'

@Service()
export class LinkService {
  constructor(@InjectRepository(Link) private readonly linkRepository: Repository<Link>) {}

  /**
   * Links paginated results search criteria
   * @returns {Promise<Brackets>}
   */
  private linksPaginatedResultsSearchBracket(query: string): Brackets {
    return new Brackets((qb) => {
      qb.where(`LOWER(link.linkTitle) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
        .orWhere(`LOWER(link.url) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(link.shortenedUrl) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(link.note) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
    })
  }

  /**
   * Get all user links
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedLinkResponse>}
   */
  async getAllLinksByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedLinkResponse> {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .where(`link.linkType == '${LinkType.Link}'`)
      .andWhere('link.userId = :userId', { userId })
      .andWhere(this.linksPaginatedResultsSearchBracket(options.query))

    const paginator = buildPaginator({
      entity: Link,
      alias: 'link',
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
   * Get All links by biolink id
   * @param {string} biolinkId
   * @param {ConnectionArgs} options
   * @param {[boolean]} returnForPage
   * @returns {Promise<PaginatedLinkResponse>}
   */
  async getAllLinksByBiolinkId(
    biolinkId: string,
    options: ConnectionArgs,
    returnForPage = true
  ): Promise<PaginatedLinkResponse> {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .where(`link.linkType != '${LinkType.Social}'`)
      .andWhere('link.biolinkId = :biolinkId', { biolinkId })
      .andWhere(this.linksPaginatedResultsSearchBracket(options.query))

    if (returnForPage) {
      queryBuilder.andWhere(
        `(link.startDate IS NULL AND link.endDate IS NULL) OR (link.startDate <= :currentDate AND link.endDate >= :currentDate)`,
        {
          currentDate: moment().toISOString(),
        }
      )
    }

    const paginator = buildPaginator({
      entity: Link,
      alias: 'link',
      paginationKeys: ['order'],
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
   * Get All social links by biolink id
   * @param {string} biolinkId
   * @param {ConnectionArgs} options
   * @param {[boolean]} returnForPage
   * @returns {Promise<PaginatedLinkResponse>}
   */
  async getAllSocialLinksByBiolinkId(
    biolinkId: string,
    options: ConnectionArgs,
    returnForPage = true
  ): Promise<PaginatedLinkResponse> {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .where(`link.linkType = '${LinkType.Social}'`)
      .andWhere('link.biolinkId = :biolinkId', { biolinkId })
      .andWhere(this.linksPaginatedResultsSearchBracket(options.query))

    if (returnForPage) {
      queryBuilder.andWhere(
        `(link.startDate IS NULL AND link.endDate IS NULL) OR (link.startDate <= :currentDate AND link.endDate >= :currentDate)`,
        {
          currentDate: moment().toISOString(),
        }
      )
    }

    const paginator = buildPaginator({
      entity: Link,
      alias: 'link',
      paginationKeys: ['order'],
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
   * Generate new short link url
   * @returns {Promise<string>}
   */
  async generateNewShortUrl(): Promise<string> {
    let shortenedUrl = '0' + randToken.generate(8)
    let otherLink = await this.linkRepository.findOne({ where: { shortenedUrl } })
    while (otherLink) {
      shortenedUrl = '0' + randToken.generate(8)
      otherLink = await Link.findOne({ where: { shortenedUrl } })
    }
    return shortenedUrl
  }

  /**
   * Get link by Id
   * @param {string} linkId
   * @returns {Promise<Link>}
   */
  async getLinkById(linkId: string): Promise<Link> {
    const link = await this.linkRepository.findOne(linkId)

    if (!link) {
      throw new ApolloError('Invalid link id', ErrorCode.LINK_COULD_NOT_BE_FOUND)
    }

    return link
  }

  /**
   * Get link by shortened url id
   * @param {string} shortenedUrl
   * @returns {Promise<Link>}
   */
  async getLinkByShortenedUrl(shortenedUrl: string): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: {
        shortenedUrl,
      },
    })

    if (!link) {
      throw new ApolloError('Invalid shortened url', ErrorCode.LINK_COULD_NOT_BE_FOUND)
    }

    return link
  }

  /**
   * Create a link
   * @param {LinkUpdateBody} updateBody
   * @returns {Promise<Link>}
   */
  async createLink(updateBody: LinkUpdateBody): Promise<Link> {
    let link = await this.linkRepository.create().save()

    link = await this.updateLinkById(link.id, updateBody)

    return link
  }

  /**
   * Update link by link id
   * @param {string} linkId
   * @param {LinkUpdateBody} updateBody
   * @returns {Promise<Link>}
   */
  async updateLinkById(linkId: string, updateBody: LinkUpdateBody): Promise<Link> {
    const link = await this.getLinkById(linkId)

    if (updateBody.biolink !== undefined) link.biolink = Promise.resolve(updateBody.biolink)
    link.enablePasswordProtection = updateBody.enablePasswordProtection || false
    if (updateBody.endDate !== undefined) link.endDate = updateBody.endDate
    if (updateBody.featured !== undefined) link.featured = updateBody.featured
    if (updateBody.iconColorful !== undefined) link.iconColorful = updateBody.iconColorful
    if (updateBody.iconMinimal !== undefined) link.iconMinimal = updateBody.iconMinimal
    if (updateBody.linkColor !== undefined) link.linkColor = updateBody.linkColor
    if (updateBody.linkImage !== undefined) {
      // TODO: Upload photo to aws s3
    }
    if (updateBody.linkTitle !== undefined) link.linkTitle = updateBody.linkTitle
    if (updateBody.linkType !== undefined) link.linkType = updateBody.linkType
    if (updateBody.note !== undefined) link.note = updateBody.note
    if (updateBody.order !== undefined) link.order = updateBody.order
    if (updateBody.password !== undefined) {
      link.password = await argon2.hash(updateBody.password)
    }
    if (updateBody.platform !== undefined) link.platform = updateBody.platform
    if (updateBody.shortenedUrl !== undefined) link.shortenedUrl = updateBody.shortenedUrl
    if (updateBody.startDate !== undefined) link.startDate = updateBody.startDate
    if (updateBody.url !== undefined) link.url = updateBody.url
    if (updateBody.user !== undefined) link.user = Promise.resolve(updateBody.user)

    await link.save()
    return link
  }

  /**
   * Check if password matched
   * @param {Link} link
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatched(link: Link, password: string): Promise<boolean> {
    if (await argon2.verify(link.password || '', password)) {
      return true
    }

    return false
  }

  /**
   * Count number of links by user id
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countLinksByUserId(userId: string): Promise<number> {
    return await this.linkRepository
      .createQueryBuilder('link')
      .where('link.userId = :userId', { userId: userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('link.linkType = :linkType', { linkType: LinkType.Embed })
          qb.orWhere('link.linkType = :linkType', { linkType: LinkType.Link })
        })
      )
      .getCount()
  }

  /**
   * Count number of social links by user id
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countSocialLinksByUserId(userId: string): Promise<number> {
    return await this.linkRepository
      .createQueryBuilder('link')
      .where('link.userId = :userId', { userId: userId })
      .andWhere('link.linkType = :linkType', { linkType: LinkType.Social })
      .getCount()
  }

  /**
   * Delete link by Id
   * @param {string} linkId
   * @returns {Promise<Link>}
   */
  async softDeleteLinkById(linkId: string): Promise<Link> {
    const link = await this.getLinkById(linkId)

    await link.softRemove()

    return link
  }

  /**
   * Increases biolink links orders by 1
   * @param {string} biolinkId
   * @returns {Promise<void>}
   */
  async increaseBiolinkLinksOrderBy1(biolinkId: string): Promise<void> {
    await this.linkRepository
      .createQueryBuilder()
      .update(Link)
      .set({ order: () => '"order" + 1' })
      .where('biolinkId = :biolinkId', { biolinkId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('linkType = :linkType', { linkType: LinkType.Link })
            .orWhere('linkType = :linkType', { linkType: LinkType.Embed })
            .orWhere('linkType = :linkType', { linkType: LinkType.Line })
        })
      )
      .execute()
  }

  /**
   * Increases biolink links orders by 1
   * @param {string} biolinkId
   * @returns {Promise<void>}
   */
  async increaseBiolinkSocialLinksOrderBy1(biolinkId: string): Promise<void> {
    await this.linkRepository
      .createQueryBuilder()
      .update(Link)
      .set({ order: () => '"order" + 1' })
      .where('biolinkId = :biolinkId', { biolinkId })
      .andWhere('linkType = :linkType', { linkType: LinkType.Social })
      .execute()
  }
}
