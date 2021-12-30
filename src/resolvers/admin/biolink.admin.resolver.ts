import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { Biolink } from '../../entities'
import { BiolinkAdminInput, ConnectionArgs } from '../../input-types'
import { BiolinkController } from '../../controllers'
import { PaginatedBiolinkResponse } from '../../object-types/common/PaginatedBiolinkResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class BiolinkAdminResolver {
  constructor(private readonly biolinkController: BiolinkController) {}

  @Query(() => PaginatedBiolinkResponse, { nullable: true })
  @UseMiddleware(authAdmin('biolink.canShowList'))
  async getAllBiolinks(@Arg('options') options: ConnectionArgs): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkController.getAllBiolinks(options)
  }

  @Query(() => PaginatedBiolinkResponse, { nullable: true })
  @UseMiddleware(authAdmin('biolink.canShowList'))
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [String], { nullable: true }) categoryIds: string[]
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkController.getAllDirectories(options, categoryIds)
  }

  @Query(() => Biolink, { nullable: true })
  @UseMiddleware(authAdmin('biolink.canShow'))
  async getBiolink(@Arg('id') id: string): Promise<Biolink> {
    return await this.biolinkController.getBiolinkByAdmins(id)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authAdmin('biolink.canCreate'))
  async createBiolink(@Arg('options') options: BiolinkAdminInput): Promise<Biolink> {
    return await this.biolinkController.createBiolinkByAdmins(options)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authAdmin('biolink.canEdit'))
  async editBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: BiolinkAdminInput
  ): Promise<Biolink> {
    return await this.biolinkController.updateBiolinkByAdmins(id, options)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authAdmin('biolink.canDelete'))
  async removeBiolink(@Arg('id', { description: 'Biolink ID' }) id: string): Promise<Biolink> {
    return await this.biolinkController.deleteBiolinkByAdmins(id)
  }
}
