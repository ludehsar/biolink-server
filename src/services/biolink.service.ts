import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Biolink } from '../entities'
import { UsernameService } from './username.service'
import { ErrorCode } from '../types'
import { BiolinkUpdateBody } from '../interfaces/BiolinkUpdateBody'

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
        biolink.username = Promise.resolve(updateBody.username)
        biolink.changedUsername = true
        await this.usernameService.updateUsernameById(updateBody.username.id, {
          biolink,
          owner: await biolink.user,
          expireDate: null,
        })
      }
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
}
