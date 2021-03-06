import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { buildPaginator } from 'typeorm-cursor-pagination'
import * as argon2 from 'argon2'

import { Biolink } from '../entities'
import { UsernameService } from './username.service'
import { ErrorCode } from '../types'
import { BiolinkUpdateBody } from '../interfaces/BiolinkUpdateBody'
import { ConnectionArgs } from '../input-types'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'
import { DirectorySearchResponse } from '../object-types'

@Service()
export class BiolinkService {
  constructor(
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    private readonly usernameService: UsernameService
  ) {}

  /**
   * Get all biolinks
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedBiolinkResponse>}
   */
  async getAllBiolinks(options: ConnectionArgs): Promise<PaginatedBiolinkResponse> {
    const queryBuilder = this.biolinkRepository
      .createQueryBuilder('biolink')
      .leftJoinAndSelect('biolink.category', 'category')
      .leftJoinAndSelect('biolink.username', 'username')
      .andWhere(this.biolinksPaginatedResultsSearchBracket(options.query))

    const paginator = buildPaginator({
      entity: Biolink,
      alias: 'biolink',
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
   * Biolinks paginated results search criteria
   * @returns {Promise<Brackets>}
   */
  private biolinksPaginatedResultsSearchBracket(query: string): Brackets {
    return new Brackets((qb) => {
      qb.where(`LOWER(username.username) like :query`, {
        query: `%${query.toLowerCase()}%`,
      })
        .orWhere(`LOWER(biolink.displayName) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(biolink.city) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(biolink.state) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(biolink.country) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(biolink.bio) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER("biolink"."settings"->>'directoryBio') like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
        .orWhere(`LOWER(category.categoryName) like :query`, {
          query: `%${query.toLowerCase()}%`,
        })
    })
  }

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
      throw new ApolloError('Biolink not found', ErrorCode.BIOLINK_COULD_NOT_BE_FOUND)
    }

    if (updateBody.bio !== undefined) biolink.bio = updateBody.bio
    if (updateBody.category !== undefined) {
      biolink.category = Promise.resolve(updateBody.category)
    }
    if (updateBody.changedUsername !== undefined)
      biolink.changedUsername = updateBody.changedUsername
    if (updateBody.city !== undefined) biolink.city = updateBody.city
    if (updateBody.country !== undefined) biolink.country = updateBody.country
    if (updateBody.coverPhoto !== undefined) {
      // TODO: Upload photo in aws s3
    }
    if (updateBody.displayName !== undefined) biolink.displayName = updateBody.displayName
    if (updateBody.featured !== undefined) biolink.featured = updateBody.featured
    if (updateBody.latitude !== undefined) biolink.latitude = updateBody.latitude
    if (updateBody.longitude !== undefined) biolink.longitude = updateBody.longitude
    if (updateBody.profilePhoto !== undefined) {
      // TODO: Upload photo in aws s3
    }
    if (updateBody.settings !== undefined) {
      const biolinkSettings = biolink.settings || {}
      if (updateBody.settings.addedToDirectory !== undefined)
        biolinkSettings.addedToDirectory = updateBody.settings.addedToDirectory
      if (updateBody.settings.blockSearchEngineIndexing !== undefined)
        biolinkSettings.blockSearchEngineIndexing = updateBody.settings.blockSearchEngineIndexing
      if (updateBody.settings.customBrandingName !== undefined)
        biolinkSettings.customBrandingName = updateBody.settings.customBrandingName
      if (updateBody.settings.customBrandingUrl !== undefined)
        biolinkSettings.customBrandingUrl = updateBody.settings.customBrandingUrl
      if (updateBody.settings.directoryBio !== undefined)
        biolinkSettings.directoryBio = updateBody.settings.directoryBio
      if (updateBody.settings.email !== undefined) biolinkSettings.email = updateBody.settings.email
      if (updateBody.settings.emailCaptureId !== undefined)
        biolinkSettings.emailCaptureId = updateBody.settings.emailCaptureId
      if (updateBody.settings.enableColoredContactButtons !== undefined)
        biolinkSettings.enableColoredContactButtons =
          updateBody.settings.enableColoredContactButtons
      if (updateBody.settings.enableColoredSocialMediaIcons !== undefined)
        biolinkSettings.enableColoredSocialMediaIcons =
          updateBody.settings.enableColoredSocialMediaIcons
      if (updateBody.settings.enableCustomBranding !== undefined)
        biolinkSettings.enableCustomBranding = updateBody.settings.enableCustomBranding
      if (updateBody.settings.enableDarkMode !== undefined)
        biolinkSettings.enableDarkMode = updateBody.settings.enableDarkMode
      if (updateBody.settings.enableEmailCapture !== undefined)
        biolinkSettings.enableEmailCapture = updateBody.settings.enableEmailCapture
      if (updateBody.settings.enableFacebookPixel !== undefined)
        biolinkSettings.enableFacebookPixel = updateBody.settings.enableFacebookPixel
      if (updateBody.settings.enableGoogleAnalytics !== undefined)
        biolinkSettings.enableGoogleAnalytics = updateBody.settings.enableGoogleAnalytics
      if (updateBody.settings.enablePasswordProtection !== undefined)
        biolinkSettings.enablePasswordProtection = updateBody.settings.enablePasswordProtection
      if (updateBody.settings.enableSensitiveContentWarning !== undefined)
        biolinkSettings.enableSensitiveContentWarning =
          updateBody.settings.enableSensitiveContentWarning
      if (updateBody.settings.enableUtmParameters !== undefined)
        biolinkSettings.enableUtmParameters = updateBody.settings.enableUtmParameters
      if (updateBody.settings.facebookPixelId !== undefined)
        biolinkSettings.facebookPixelId = updateBody.settings.facebookPixelId
      if (updateBody.settings.googleAnalyticsCode !== undefined)
        biolinkSettings.googleAnalyticsCode = updateBody.settings.googleAnalyticsCode
      if (updateBody.settings.metaDescription !== undefined)
        biolinkSettings.metaDescription = updateBody.settings.metaDescription
      if (updateBody.settings.opengraphImageUrl !== undefined)
        biolinkSettings.opengraphImageUrl = updateBody.settings.opengraphImageUrl
      if (updateBody.settings.pageTitle !== undefined)
        biolinkSettings.pageTitle = updateBody.settings.pageTitle
      if (updateBody.settings.password !== undefined)
        biolinkSettings.password = await argon2.hash(updateBody.settings.password)
      if (updateBody.settings.payoneerLink !== undefined)
        biolinkSettings.payoneerLink = updateBody.settings.payoneerLink
      if (updateBody.settings.paypalLink !== undefined)
        biolinkSettings.paypalLink = updateBody.settings.paypalLink
      if (updateBody.settings.phone !== undefined) biolinkSettings.phone = updateBody.settings.phone
      if (updateBody.settings.removeDefaultBranding !== undefined)
        biolinkSettings.removeDefaultBranding = updateBody.settings.removeDefaultBranding
      if (updateBody.settings.showEmail !== undefined)
        biolinkSettings.showEmail = updateBody.settings.showEmail
      if (updateBody.settings.showPhone !== undefined)
        biolinkSettings.showPhone = updateBody.settings.showPhone
      if (updateBody.settings.socialAccountStyleType !== undefined)
        biolinkSettings.socialAccountStyleType = updateBody.settings.socialAccountStyleType
      if (updateBody.settings.utmCampaign !== undefined)
        biolinkSettings.utmCampaign = updateBody.settings.utmCampaign
      if (updateBody.settings.utmMedium !== undefined)
        biolinkSettings.utmMedium = updateBody.settings.utmMedium
      if (updateBody.settings.utmSource !== undefined)
        biolinkSettings.utmSource = updateBody.settings.utmSource
      if (updateBody.settings.venmoLink !== undefined)
        biolinkSettings.venmoLink = updateBody.settings.venmoLink
      biolink.settings = biolinkSettings
    }
    if (updateBody.state !== undefined) biolink.state = updateBody.state
    if (updateBody.user !== undefined) biolink.user = Promise.resolve(updateBody.user)
    if (updateBody.username !== undefined) {
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
    if (updateBody.verification !== undefined) {
      biolink.verification = Promise.resolve(updateBody.verification)
    }
    if (updateBody.verificationStatus !== undefined)
      biolink.verificationStatus = updateBody.verificationStatus
    if (updateBody.verifiedEmail !== undefined) biolink.verifiedEmail = updateBody.verifiedEmail
    if (updateBody.verifiedGovernmentId !== undefined)
      biolink.verifiedGovernmentId = updateBody.verifiedGovernmentId
    if (updateBody.verifiedPhoneNumber !== undefined)
      biolink.verifiedPhoneNumber = updateBody.verifiedPhoneNumber
    if (updateBody.verifiedWorkEmail !== undefined)
      biolink.verifiedWorkEmail = updateBody.verifiedWorkEmail

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
      .andWhere(this.biolinksPaginatedResultsSearchBracket(options.query))

    const paginator = buildPaginator({
      entity: Biolink,
      alias: 'biolink',
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
   * Get all directories
   * @param {ConnectionArgs} options
   * @param {number[]} categoryIds
   * @returns {Promise<PaginatedBiolinkResponse>}
   */
  async getAllDirectories(
    options: ConnectionArgs,
    searchParameter?:
      | 'username'
      | 'displayName'
      | 'city'
      | 'state'
      | 'country'
      | 'bio'
      | 'directoryBio'
      | 'categoryName',
    categoryIds?: string[]
  ): Promise<PaginatedBiolinkResponse> {
    const queryBuilder = this.biolinkRepository
      .createQueryBuilder('biolink')
      .leftJoinAndSelect('biolink.category', 'category')
      .leftJoinAndSelect('biolink.user', 'user')
      .leftJoinAndSelect('biolink.username', 'username')
      .where(`cast ("biolink"."settings"->>'addedToDirectory' as boolean) = true`)

    if (searchParameter) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          switch (searchParameter) {
            case 'username': {
              qb.where(`LOWER(username.username) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'displayName': {
              qb.where(`LOWER(biolink.displayName) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'city': {
              qb.where(`LOWER(biolink.city) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'state': {
              qb.where(`LOWER(biolink.state) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'country': {
              qb.where(`LOWER(biolink.country) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'bio': {
              qb.where(`LOWER(biolink.bio) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'directoryBio': {
              qb.where(`LOWER("biolink"."settings"->>'directoryBio') like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            case 'categoryName': {
              qb.where(`LOWER(category.categoryName) like :query`, {
                query: `%${options.query.toLowerCase()}%`,
              })
              break
            }
            default:
              break
          }
        })
      )
    } else {
      queryBuilder.andWhere(this.biolinksPaginatedResultsSearchBracket(options.query))
    }

    if (categoryIds) {
      queryBuilder.andWhere('biolink.categoryId in (:...categoryIds)', { categoryIds })
    }

    const paginator = buildPaginator({
      entity: Biolink,
      alias: 'biolink',
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
   * Get directory search queries
   * @param {string} query
   * @returns {Promise<DirectorySearchResponse>}
   */
  async directorySearchQueries(query: string): Promise<DirectorySearchResponse> {
    const response: DirectorySearchResponse = {}

    try {
      const biolinksForCategoryName = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'categoryName'
        )
      ).data

      response.results = await Promise.all(
        biolinksForCategoryName.map(async (biolink) => (await biolink.category)?.categoryName || '')
      )

      const biolinksForUsername = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'username'
        )
      ).data

      response.results = response.results.concat(
        await Promise.all(
          biolinksForUsername.map(async (biolink) => (await biolink.username)?.username || '')
        )
      )

      const biolinksForDisplayName = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'displayName'
        )
      ).data

      response.results = response.results.concat(
        biolinksForDisplayName.map((biolink) => biolink.displayName || '')
      )

      const biolinksForDirectoryBio = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'directoryBio'
        )
      ).data

      response.results = response.results.concat(
        biolinksForDirectoryBio.map((biolink) => biolink.settings.directoryBio || '')
      )

      const biolinksForBio = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'bio'
        )
      ).data

      response.results = response.results.concat(biolinksForBio.map((biolink) => biolink.bio || ''))

      const biolinksForCity = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'city'
        )
      ).data

      response.results = response.results.concat(
        biolinksForCity.map((biolink) => biolink.city || '')
      )

      const biolinksForState = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'state'
        )
      ).data

      response.results = response.results.concat(
        biolinksForState.map((biolink) => biolink.state || '')
      )

      const biolinksForCountry = (
        await this.getAllDirectories(
          {
            limit: Math.max(10 - (response.results || []).length, 0),
            order: 'ASC',
            query,
          },
          'country'
        )
      ).data

      response.results = response.results.concat(
        biolinksForCountry.map((biolink) => biolink.country || '')
      )
    } catch (err: any) {
      throw new ApolloError(err.message, ErrorCode.DATABASE_ERROR)
    }

    return response
  }

  /**
   * Delete biolink by Id
   * @param {string} biolinkId
   * @returns {Promise<Biolink>}
   */
  async softDeleteBiolinkById(biolinkId: string): Promise<Biolink> {
    const biolink = await this.getBiolinkById(biolinkId)

    await biolink.softRemove()

    return biolink
  }
}
