import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'

import { CurrentUser } from '../../decorators'
import { Biolink, User } from '../../entities'
import {
  NewBiolinkInput,
  UpdateBiolinkProfileInput,
  DarkModeInput,
  ContactButtonInput,
  SocialAccountsInput,
  IntegrationInput,
  UTMParameterInput,
  SEOInput,
  BrandingInput,
  PrivacyInput,
  DirectoryInput,
  SortedLinksInput,
  DonationInput,
  ConnectionArgs,
} from '../../input-types'
import { BiolinkResponse, DefaultResponse, DirectorySearchResponse } from '../../object-types'
import { sortBiolinkLinks, removeBiolink, importFromLinktree } from '../../services'
import { MyContext } from '../../types'
import { authUser, emailVerified } from '../../middlewares'
import { BiolinkController } from '../../controllers'
import { PaginatedBiolinkResponse } from '../../object-types/common/PaginatedBiolinkResponse'

@Resolver()
export class BiolinkResolver {
  constructor(private readonly biolinkController: BiolinkController) {}

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async createNewBiolink(
    @Arg('options') options: NewBiolinkInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.createBiolink(options, context)
  }

  @Query(() => Biolink)
  async getBiolinkFromUsername(
    @Arg('username', { description: 'Biolink Username' }) username: string,
    @Arg('password', { description: 'Biolink Password', nullable: true }) password: string
  ): Promise<Biolink> {
    return await this.biolinkController.getBiolinkFromUsername(username, password)
  }

  @Query(() => Biolink, { nullable: true })
  @UseMiddleware(authUser)
  async getBiolink(@Arg('id') id: string, @Ctx() context: MyContext): Promise<Biolink> {
    return await this.biolinkController.getBiolink(id, context)
  }

  @Query(() => PaginatedBiolinkResponse)
  @UseMiddleware(authUser)
  async getAllUserBiolinks(
    @Arg('options') options: ConnectionArgs,
    @Ctx() context: MyContext
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkController.getAllUserBiolinks(options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateBiolinkProfile(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateBiolinkProfile(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateDarkModeOptions(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DarkModeInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateBiolinkTheme(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateDonationSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DonationInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateDonationLink(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateContactButtonSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: ContactButtonInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateContactButtons(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateSocialAccountsSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: SocialAccountsInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateSocialIconSettings(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateIntegrationSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: IntegrationInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateIntegrationSettings(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateUTMParameterSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: UTMParameterInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateUTMParameter(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateSEOSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: SEOInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateSEOSettings(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateBrandingSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: BrandingInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateBrandSettings(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updatePrivacySettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: PrivacyInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updatePrivacySettings(id, options, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async uploadBiolinkProfilePhoto(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('profilePhoto', () => GraphQLUpload) profilePhoto: FileUpload,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.uploadProfilePhoto(id, profilePhoto, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async uploadBiolinkCoverPhoto(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('coverPhoto', () => GraphQLUpload) coverPhoto: FileUpload,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.uploadCoverPhoto(id, coverPhoto, context)
  }

  @Mutation(() => Biolink)
  @UseMiddleware(authUser, emailVerified)
  async updateDirectorySettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DirectoryInput,
    @Ctx() context: MyContext
  ): Promise<Biolink> {
    return await this.biolinkController.updateDirectorySettings(id, options, context)
  }

  @Mutation(() => BiolinkResponse)
  async sortBiolinkLinks(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: SortedLinksInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await sortBiolinkLinks(id, options, context, user)
  }

  @Query(() => PaginatedBiolinkResponse, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds: number[]
  ): Promise<PaginatedBiolinkResponse> {
    return await this.biolinkController.getAllDirectories(options, categoryIds)
  }

  @Query(() => DirectorySearchResponse, { nullable: true })
  async getSearchQueries(
    @Arg('query', { defaultValue: '' }) query: string
  ): Promise<DirectorySearchResponse> {
    return await this.biolinkController.getSearchQueries(query)
  }

  @Mutation(() => DefaultResponse)
  @UseMiddleware(authUser, emailVerified)
  async removeBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await removeBiolink(id, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(authUser, emailVerified)
  async importBiolinkDetailsFromLinktreeProfile(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('linktreeUsername') linktreeUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await importFromLinktree(id, linktreeUsername, context, user)
  }
}
