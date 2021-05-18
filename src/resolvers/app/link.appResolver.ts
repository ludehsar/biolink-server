import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import {
  createLinkFromUsername,
  createNewLink,
  getAllLinksFromBiolinkUsername,
  getLinkByShortenedUrl,
  removeLinkByShortenedUrl,
} from '../../controllers/link.controller'
import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { MyContext } from '../../MyContext'
import { LinkResponse, NewLinkInput } from '../../typeDefs/link.typeDef'

@Resolver()
export class LinkResolver {
  @Query(() => LinkResponse)
  async getAllLinksFromBiolinkUsername(
    @Arg('username') username: string,
    @Arg('showOnPage') showOnPage: boolean,
    @CurrentUser() currentUser: User
  ): Promise<LinkResponse> {
    return await getAllLinksFromBiolinkUsername(username, showOnPage, currentUser)
  }

  @Mutation(() => LinkResponse)
  async createLinkFromBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: NewLinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await createLinkFromUsername(username, options, user, context)
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
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<LinkResponse> {
    return await getLinkByShortenedUrl(shortenedUrl, context, user)
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
