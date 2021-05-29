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
  async getAllLinksFromBiolinkUsername(
    @Arg('username') username: string,
    @Arg('showOnPage') showOnPage: boolean,
    @CurrentUser() currentUser: User
  ): Promise<LinkListResponse> {
    return await getAllLinksOfBiolink(username, showOnPage, currentUser)
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
  async updateLinkByShortenedUrl(
    @Arg('shortenedUrl') shortenedUrl: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User,
    @Arg('username', { nullable: true }) username?: string
  ): Promise<LinkResponse> {
    return await updateLink(shortenedUrl, options, user, context, username)
  }

  @Query(() => LinkResponse)
  async getLinkByShortenedUrl(
    @Arg('shortenedUrl') shortenedUrl: string,
    @Arg('password', { nullable: true }) password: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await getLinkByShortenedUrl(shortenedUrl, context, user, password)
  }

  @Mutation(() => LinkResponse)
  async removeLinkByShortenedUrl(
    @Arg('shortenedUrl') shortenedUrl: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await removeLink(shortenedUrl, user, context)
  }
}
