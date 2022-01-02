import { Service } from 'typedi'
import { ApolloError, ForbiddenError } from 'apollo-server-express'

import { User, Verification } from '../entities'
import { VerificationService } from '../services/verification.service'
import { ConnectionArgs, VerificationInput, VerificationStatusInput } from '../input-types'
import { PaginatedVerificationResponse } from '../object-types/common/PaginatedVerificationResponse'
import { BiolinkService } from '../services/biolink.service'
import { CategoryService } from '../services/category.service'
import { ErrorCode, MyContext } from '../types'
import { PlanService } from '../services/plan.service'
import { VerificationStatus } from '../enums'

@Service()
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly biolinkService: BiolinkService,
    private readonly categoryService: CategoryService,
    private readonly planService: PlanService
  ) {}

  async addVerification(
    biolinkId: string,
    input: VerificationInput,
    context: MyContext
  ): Promise<Verification> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)

    let category = undefined
    if (input.categoryId)
      category = await this.categoryService.getCategoryByCategoryId(input.categoryId)

    if (input.username && (await biolink.username)?.username !== input.username) {
      throw new ApolloError('Username does not match', ErrorCode.USERNAME_NOT_FOUND)
    }

    if (biolink.userId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    if (
      !(await this.planService.getValuesFromPlanSettingsByPlanId(
        (context.user as User).planId,
        'verifiedCheckmarkEnabled'
      ))
    ) {
      throw new ApolloError(
        'Upgrade plan to support adding verification checkmark to the profile',
        ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST
      )
    }

    return await this.verificationService.createVerification({
      biolink,
      businessDocument: input.businessDocument,
      category,
      email: input.email,
      firstName: input.firstName,
      instagramUrl: input.instagramAccount,
      lastName: input.lastName,
      linkedinUrl: input.linkedinAccount,
      mobileNumber: input.mobileNumber,
      otherDocuments: input.otherDocuments,
      photoId: input.photoId,
      twitterUrl: input.twitterAccount,
      user: context.user,
      username: input.username,
      websiteLink: input.websiteLink,
      workNumber: input.workNumber,
    })
  }

  async getAllPendingVerifications(
    options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationService.getAllVerifications(VerificationStatus.Pending, options)
  }

  async getAllVerifiedVerifications(
    options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationService.getAllVerifications(VerificationStatus.Verified, options)
  }

  async getAllRejectedVerifications(
    options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationService.getAllVerifications(VerificationStatus.Rejected, options)
  }

  async getVerification(verificationId: string): Promise<Verification> {
    return await this.verificationService.getVerificationByVerificationId(verificationId)
  }

  async editVerificationStatus(
    verificationId: string,
    input: VerificationStatusInput
  ): Promise<Verification> {
    return await this.verificationService.updateVerificationStatusByVerificationId(verificationId, {
      verificationStatus: input.status,
      verifiedEmail: input.verifiedEmail,
      verifiedGovernmentId: input.verifiedGovernmentId,
      verifiedPhoneNumber: input.verifiedPhoneNumber,
      verifiedWorkEmail: input.verifiedWorkEmail,
    })
  }

  async deleteVerification(verificationId: string): Promise<Verification> {
    return await this.verificationService.softDeleteVerificationByVerificationId(verificationId)
  }
}
