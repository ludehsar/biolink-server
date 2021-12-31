import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { ConnectionArgs, LinkAdminInput } from '../../input-types'
import { PaginatedLinkResponse } from '../../object-types/common/PaginatedLinkResponse'
import { LinkController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { Link } from '../../entities'

@Resolver()
export class LinkAdminResolver {
  constructor(private readonly linkController: LinkController) {}

  @Query(() => PaginatedLinkResponse, { nullable: true })
  @UseMiddleware(authAdmin('link.canShowList'))
  async getAllLinks(@Arg('options') options: ConnectionArgs): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllLinks(options)
  }

  @Query(() => PaginatedLinkResponse, { nullable: true })
  @UseMiddleware(authAdmin('link.canShowList'))
  async getAllEmbeds(@Arg('options') options: ConnectionArgs): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllEmbeds(options)
  }

  @Query(() => PaginatedLinkResponse, { nullable: true })
  @UseMiddleware(authAdmin('link.canShowList'))
  async getAllSocialLinks(@Arg('options') options: ConnectionArgs): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllSocialLinks(options)
  }

  @Query(() => Link, { nullable: true })
  @UseMiddleware(authAdmin('link.canShow'))
  async getLink(@Arg('linkId', () => String) linkId: string): Promise<Link> {
    return await this.linkController.getLinkByAdmins(linkId)
  }

  @Mutation(() => Link, { nullable: true })
  @UseMiddleware(authAdmin('link.canCreate'))
  async createLink(@Arg('options') options: LinkAdminInput): Promise<Link> {
    return await this.linkController.createLinkByAdmins(options)
  }

  @Mutation(() => Link, { nullable: true })
  @UseMiddleware(authAdmin('link.canEdit'))
  async editLink(
    @Arg('linkId', () => String) linkId: string,
    @Arg('options') options: LinkAdminInput
  ): Promise<Link> {
    return await this.linkController.updateLinksByAdmins(linkId, options)
  }

  @Mutation(() => Link, { nullable: true })
  @UseMiddleware(authAdmin('link.canDelete'))
  async deleteLink(@Arg('linkId', () => String) linkId: string): Promise<Link> {
    return await this.linkController.deleteLinksByAdmins(linkId)
  }
}
