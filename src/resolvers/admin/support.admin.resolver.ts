import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, SupportAdminInput } from '../../input-types'
import { Support } from '../../entities'
import { PaginatedSupportResponse } from '../../object-types/common/PaginatedSupportSettings'
import { SupportController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class SupportAdminResolver {
  constructor(private readonly supportController: SupportController) {}

  @Query(() => PaginatedSupportResponse, { nullable: true })
  @UseMiddleware(authAdmin('support.canShowList'))
  async getAllPendingSupports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedSupportResponse> {
    return await this.supportController.getAllPendingSupports(options)
  }

  @Query(() => PaginatedSupportResponse, { nullable: true })
  @UseMiddleware(authAdmin('support.canShowList'))
  async getAllResolvedSupports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedSupportResponse> {
    return await this.supportController.getAllResolvedSupports(options)
  }

  @Query(() => PaginatedSupportResponse, { nullable: true })
  @UseMiddleware(authAdmin('support.canShowList'))
  async getAllDismissedSupports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedSupportResponse> {
    return await this.supportController.getAllDismissedSupports(options)
  }

  @Query(() => Support, { nullable: true })
  @UseMiddleware(authAdmin('support.canShow'))
  async getSupport(@Arg('supportId', () => String) supportId: string): Promise<Support> {
    return await this.supportController.getSupport(supportId)
  }

  @Mutation(() => Support, { nullable: true })
  @UseMiddleware(authAdmin('support.canEdit'))
  async replyToSupport(
    @Arg('supportId', () => String) supportId: string,
    @Arg('options', () => SupportAdminInput) options: SupportAdminInput
  ): Promise<Support> {
    return await this.supportController.replySupportBySupportId(supportId, options)
  }
}
