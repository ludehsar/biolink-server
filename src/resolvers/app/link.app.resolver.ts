import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { emailVerified } from '../../middlewares'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { NewLinkInput } from '../../input-types'
import { LinkListResponse, LinkResponse } from '../../object-types'
import {
  getAllLinksOfBiolink,
  getAllUserLinks,
  createNewLink,
  updateLink,
  getLinkByShortenedUrl,
  removeLink,
} from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class LinkResolver {
  @Query(() => LinkListResponse)
  async getAllLinksOfBiolink(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('showOnPage') showOnPage: boolean,
    @CurrentUser() currentUser: User,
    @Ctx() context: MyContext
  ): Promise<LinkListResponse> {
    return await getAllLinksOfBiolink(biolinkId, showOnPage, currentUser, context)
  }

  @Query(() => LinkListResponse)
  async getAllUserLinks(
    @CurrentUser() currentUser: User,
    @Ctx() context: MyContext
  ): Promise<LinkListResponse> {
    return await getAllUserLinks(currentUser, context)
  }

  @Mutation(() => LinkResponse)
  // @UseMiddleware(emailVerified)
  async createNewLink(
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User,
    @Arg('biolinkId', { nullable: true, description: 'Biolink ID' }) biolinkId?: string
  ): Promise<LinkResponse> {
    return await createNewLink(options, context, user, biolinkId)
  }

  @Mutation(() => LinkResponse)
  @UseMiddleware(emailVerified)
  async updateLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User,
    @Arg('biolinkId', { nullable: true, description: 'Biolink ID' }) biolinkId?: string
  ): Promise<LinkResponse> {
    return await updateLink(id, options, user, context, biolinkId)
  }

  @Query(() => LinkResponse)
  async getLinkByShortenedUrl(
    @Arg('shortenedUrl', { description: 'Shortened URL' }) shortenedUrl: string,
    @Arg('password', { nullable: true }) password: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await getLinkByShortenedUrl(shortenedUrl, context, user, password)
  }

  @Mutation(() => LinkResponse)
  @UseMiddleware(emailVerified)
  async removeLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await removeLink(id, user, context)
  }
}
