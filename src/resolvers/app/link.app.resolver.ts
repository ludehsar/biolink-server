import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser, emailVerified } from '../../middlewares'
import { Link } from '../../entities'
import { ConnectionArgs, NewLinkInput } from '../../input-types'
import { MyContext } from '../../types'
import { LinkController } from '../../controllers'
import { PaginatedLinkResponse } from '../../object-types/common/PaginatedLinkResponse'
import { NewEmbedInput } from '../../input-types/links/NewEmbedInput'
import { NewLineInput } from '../../input-types/links/NewLineInput'
import { NewSocialLinkInput } from '../../input-types/links/NewSocialLinkInput'

@Resolver()
export class LinkResolver {
  constructor(private readonly linkController: LinkController) {}

  @Query(() => PaginatedLinkResponse)
  @UseMiddleware(authUser)
  async getAllLinksByBiolinkId(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllLinksByBiolinkId(options, biolinkId, context)
  }

  @Query(() => PaginatedLinkResponse)
  @UseMiddleware(authUser)
  async getAllSocialLinksByBiolinkId(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllSocialLinksByBiolinkId(options, biolinkId, context)
  }

  @Query(() => PaginatedLinkResponse)
  async getAllLinksByBiolinkUsername(
    @Arg('username', { description: 'Biolink Username' }) username: string,
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllLinksByBiolinkUsername(options, username)
  }

  @Query(() => PaginatedLinkResponse)
  async getAllSocialLinksByBiolinkUsername(
    @Arg('username', { description: 'Biolink Username' }) username: string,
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllSocialLinksByBiolinkUsername(options, username)
  }

  @Query(() => PaginatedLinkResponse)
  @UseMiddleware(authUser)
  async getAllUserLinks(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedLinkResponse> {
    return await this.linkController.getAllUserLinks(options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async createNewLink(
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.createNewLink(options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async createNewEmbed(
    @Arg('options') options: NewEmbedInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.createNewEmbed(options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async createNewLine(
    @Arg('options') options: NewLineInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.createNewLine(options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async createNewSocialLink(
    @Arg('options') options: NewSocialLinkInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.createNewSocialLink(options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async updateLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.updateLinkById(id, options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async updateEmbed(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewEmbedInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.updateEmbedById(id, options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async updateLine(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewLineInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.updateLineById(id, options, context)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async updateSocialLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewSocialLinkInput,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.updateSocialLinkByLinkId(id, options, context)
  }

  @Query(() => Link)
  async getLinkByShortUrl(
    @Arg('shortUrl', { description: 'Shortened URL' }) shortenedUrl: string,
    @Arg('password', { nullable: true }) password: string,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.getLinkByShortUrl(shortenedUrl, context, password)
  }

  @Mutation(() => Link)
  @UseMiddleware(authUser, emailVerified)
  async removeLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Ctx() context: MyContext
  ): Promise<Link> {
    return await this.linkController.removeLink(id, context)
  }
}
