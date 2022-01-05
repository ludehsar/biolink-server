import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, VerificationStatusInput } from '../../input-types'
import { Verification } from '../../entities'
import { VerificationController } from '../../controllers'
import { PaginatedVerificationResponse } from '../../object-types/common/PaginatedVerificationResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class VerificationAdminResolver {
  constructor(private readonly verificationController: VerificationController) {}

  @Query(() => PaginatedVerificationResponse, { nullable: true })
  @UseMiddleware(authAdmin('verification.canShowList'))
  async getAllPendingVerifications(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationController.getAllPendingVerifications(options)
  }

  @Query(() => PaginatedVerificationResponse, { nullable: true })
  @UseMiddleware(authAdmin('verification.canShowList'))
  async getAllVerifiedVerifications(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationController.getAllVerifiedVerifications(options)
  }

  @Query(() => PaginatedVerificationResponse, { nullable: true })
  @UseMiddleware(authAdmin('verification.canShowList'))
  async getAllRejectedVerifications(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedVerificationResponse> {
    return await this.verificationController.getAllRejectedVerifications(options)
  }

  @Query(() => Verification, { nullable: true })
  @UseMiddleware(authAdmin('verification.canShow'))
  async getVerification(
    @Arg('verificationId', () => String) verificationId: string
  ): Promise<Verification> {
    return await this.verificationController.getVerification(verificationId)
  }

  @Mutation(() => Verification, { nullable: true })
  @UseMiddleware(authAdmin('verification.canEdit'))
  async changeVerificationStatus(
    @Arg('verificationId', () => String) verificationId: string,
    @Arg('options', () => VerificationStatusInput) options: VerificationStatusInput
  ): Promise<Verification> {
    return await this.verificationController.editVerificationStatus(verificationId, options)
  }

  @Mutation(() => Verification, { nullable: true })
  @UseMiddleware(authAdmin('verification.canDelete'))
  async deleteVerification(
    @Arg('verificationId', () => String) verificationId: string
  ): Promise<Verification> {
    return await this.verificationController.deleteVerification(verificationId)
  }
}
