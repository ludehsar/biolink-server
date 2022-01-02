import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-express'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Verification } from '../entities'
import { VerificationUpdateBody } from '../interfaces/VerificationUpdateBody'
import { PaginatedVerificationResponse } from '../object-types/common/PaginatedVerificationResponse'
import { ConnectionArgs } from '../input-types'
import { ErrorCode } from '../types'
import { VerificationStatus } from '../enums'

@Service()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>
  ) {}

  /**
   * Creates a new verification
   * @param {VerificationUpdateBody} updateBody
   * @returns {Promise<boolean>}
   */
  async createVerification(updateBody: VerificationUpdateBody): Promise<Verification> {
    const businessDocumentUrl = undefined
    if (updateBody.businessDocument !== undefined) {
      // TODO: Upload file in aws s3
    }

    const otherDocumentsUrl = undefined
    if (updateBody.otherDocuments !== undefined) {
      // TODO: Upload file in aws s3
    }

    const photoIdUrl = undefined
    if (updateBody.photoId !== undefined) {
      // TODO: Upload file in aws s3
    }

    const verification = this.verificationRepository.create({
      businessDocumentUrl,
      email: updateBody.email,
      firstName: updateBody.firstName,
      instagramUrl: updateBody.instagramUrl,
      lastName: updateBody.lastName,
      linkedinUrl: updateBody.linkedinUrl,
      mobileNumber: updateBody.mobileNumber,
      otherDocumentsUrl,
      photoIdUrl,
      twitterUrl: updateBody.twitterUrl,
      username: updateBody.username,
      verificationStatus: VerificationStatus.Pending,
      verifiedEmail: false,
      verifiedGovernmentId: false,
      verifiedPhoneNumber: false,
      verifiedWorkEmail: false,
      websiteLink: updateBody.websiteLink,
      workNumber: updateBody.workNumber,
    })

    if (updateBody.biolink !== undefined) verification.biolink = Promise.resolve(updateBody.biolink)
    if (updateBody.category !== undefined)
      verification.category = Promise.resolve(updateBody.category)
    if (updateBody.user !== undefined) verification.user = Promise.resolve(updateBody.user)

    await verification.save()

    return verification
  }

  /**
   * Get verification by verification id
   * @param {string} verificationId
   * @returns {Promise<Verification>}
   */
  async getVerificationByVerificationId(verificationId: string): Promise<Verification> {
    const verification = await this.verificationRepository.findOne(verificationId)

    if (!verification) {
      throw new ApolloError('Verification not found', ErrorCode.VERIFICATION_NOT_FOUND)
    }

    return verification
  }

  /**
   * Update verification by verification id
   * @param {string} verificationId
   * @param {VerificationUpdateBody} updateBody
   * @returns {Promise<Verification>}
   */
  async updateVerificationStatusByVerificationId(
    verificationId: string,
    updateBody: VerificationUpdateBody
  ): Promise<Verification> {
    const verification = await this.getVerificationByVerificationId(verificationId)

    if (updateBody.verificationStatus !== undefined)
      verification.verificationStatus = updateBody.verificationStatus
    if (updateBody.verifiedEmail !== undefined)
      verification.verifiedEmail = updateBody.verifiedEmail
    if (updateBody.verifiedGovernmentId !== undefined)
      verification.verifiedGovernmentId = updateBody.verifiedGovernmentId
    if (updateBody.verifiedPhoneNumber !== undefined)
      verification.verifiedPhoneNumber = updateBody.verifiedPhoneNumber
    if (updateBody.verifiedWorkEmail !== undefined)
      verification.verifiedWorkEmail = updateBody.verifiedWorkEmail

    await verification.save()

    return verification
  }

  /**
   * Get all verifications
   * @param {VerificationStatus} status
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedVerificationResponse>}
   */
  async getAllVerifications(
    status: VerificationStatus,
    options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    const queryBuilder = this.verificationRepository
      .createQueryBuilder('verification')
      .where('verification.verificationStatus = :status', { status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(verification.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(verification.internalName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(verification.name) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Verification,
      alias: 'verification',
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
   * Soft Delete verification by verification id
   * @param {string} verificationId
   * @returns {Promise<Verification>}
   */
  async softDeleteVerificationByVerificationId(verificationId: string): Promise<Verification> {
    const verification = await this.getVerificationByVerificationId(verificationId)

    await verification.softRemove()

    return verification
  }
}
