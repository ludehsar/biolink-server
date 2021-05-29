import { CurrentUser } from 'decorators'
import { User } from 'entities'
import { NewLinkInput } from 'input-types'
import { LinkListResponse, LinkResponse } from 'object-types'
import {
  getAllLinksOfBiolink,
  getAllUserLinks,
  createNewLink,
  updateLink,
  getLinkByShortenedUrl,
  removeLink,
} from 'services'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from 'types'

@Resolver()
export class LinkResolver {
  @Query(() => LinkListResponse)
  async getAllLinksOfBiolink(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('showOnPage') showOnPage: boolean,
    @CurrentUser() currentUser: User
  ): Promise<LinkListResponse> {
    return await getAllLinksOfBiolink(biolinkId, showOnPage, currentUser)
  }

  @Query(() => LinkListResponse)
  async getAllUserLinks(@CurrentUser() currentUser: User): Promise<LinkListResponse> {
    return await getAllUserLinks(currentUser)
  }

  @Mutation(() => LinkResponse)
  async createNewLink(
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User,
    @Arg('username', { nullable: true }) username?: string
  ): Promise<LinkResponse> {
    return await createNewLink(options, user, context, username)
  }

  @Mutation(() => LinkResponse)
  async updateLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User,
    @Arg('username', { nullable: true }) username?: string
  ): Promise<LinkResponse> {
    return await updateLink(id, options, user, context, username)
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
  async removeLink(
    @Arg('id', { description: 'Link ID' }) id: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await removeLink(id, user, context)
  }
}
