import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import {
  createNewLink,
  getAllLinksFromBiolinkUsername,
  getAllUserLinks,
  getLinkByShortenedUrl,
  removeLinkByShortenedUrl,
} from '../../controllers/app/link.controller'
import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import { LinkListResponse, LinkResponse, NewLinkInput } from '../../typeDefs/link.typeDef'

@Resolver()
export class LinkResolver {
  @Query(() => LinkListResponse)
  async getAllLinksFromBiolinkUsername(
    @Arg('username') username: string,
    @Arg('showOnPage') showOnPage: boolean,
    @CurrentUser() currentUser: User
  ): Promise<LinkListResponse> {
    return await getAllLinksFromBiolinkUsername(username, showOnPage, currentUser)
  }

  @Query(() => LinkListResponse)
  async getAllUserLinks(@CurrentUser() currentUser: User): Promise<LinkListResponse> {
    return await getAllUserLinks(currentUser)
  }

  @Mutation(() => LinkResponse)
  async createLinkFromBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await createNewLink(options, user, context, username)
  }

  @Mutation(() => LinkResponse)
  async createNewLink(
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await createNewLink(options, user, context)
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
    return await removeLinkByShortenedUrl(shortenedUrl, user, context)
  }
}
