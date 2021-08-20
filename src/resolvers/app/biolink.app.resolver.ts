import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'

import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
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
  ConnectionArgs,
  DonationInput,
} from '../../input-types'
import {
  BiolinkResponse,
  BiolinkListResponse,
  BiolinkConnection,
  DefaultResponse,
  DirectorySearchResponse,
} from '../../object-types'
import {
  createBiolink,
  getBiolinkFromUsername,
  getUserBiolinks,
  updateBiolink,
  updateDarkModeSettings,
  updateContactButtonSettings,
  updateSocialAccountsSettings,
  updateIntegrationSettings,
  updateUTMParameterSettings,
  updateSEOSettings,
  updateBrandingSettings,
  updatePrivacySettings,
  uploadBiolinkProfilePhoto,
  uploadBiolinkCoverPhoto,
  updateDirectorySettings,
  sortBiolinkLinks,
  getDirectoriesPaginated,
  removeBiolink,
  importFromLinktree,
  getSearchQueries,
  updateDonationSettings,
  getBiolink,
} from '../../services'
import { MyContext } from '../../types'
import { emailVerified } from '../../middlewares'

@Resolver()
export class BiolinkResolver {
  @Mutation(() => BiolinkResponse)
  async createNewBiolink(
    @Arg('options') options: NewBiolinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createBiolink(options, context, user)
  }

  @Query(() => BiolinkResponse)
  async getBiolinkFromUsername(
    @Arg('username', { description: 'Biolink Username' }) username: string,
    @Arg('password', { description: 'Biolink Password', nullable: true }) password: string,
    @Ctx() context: MyContext
  ): Promise<BiolinkResponse> {
    return await getBiolinkFromUsername(username, context, password)
  }

  @Query(() => BiolinkResponse, { nullable: true })
  async getBiolink(
    @Arg('id') id: string,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkResponse> {
    return await getBiolink(id, user, context)
  }

  @Query(() => BiolinkListResponse)
  async getAllUserBiolinks(
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<BiolinkListResponse> {
    return await getUserBiolinks(user, context)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolink(user, id, options, context)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateDarkModeOptions(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DarkModeInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateDarkModeSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateDonationSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DonationInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateDonationSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateContactButtonSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: ContactButtonInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateContactButtonSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateSocialAccountsSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: SocialAccountsInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateSocialAccountsSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateIntegrationSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: IntegrationInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateIntegrationSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateUTMParameterSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: UTMParameterInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateUTMParameterSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateSEOSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: SEOInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateSEOSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateBrandingSettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: BrandingInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBrandingSettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updatePrivacySettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: PrivacyInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updatePrivacySettings(id, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async uploadBiolinkProfilePhoto(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('profilePhoto', () => GraphQLUpload) profilePhoto: FileUpload,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await uploadBiolinkProfilePhoto(id, profilePhoto, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async uploadBiolinkCoverPhoto(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('coverPhoto', () => GraphQLUpload) coverPhoto: FileUpload,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await uploadBiolinkCoverPhoto(id, coverPhoto, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async updateDirectorySettings(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('options') options: DirectoryInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateDirectorySettings(id, options, context, user)
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

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds: number[]
  ): Promise<BiolinkConnection> {
    return await getDirectoriesPaginated(categoryIds, options)
  }

  @Query(() => DirectorySearchResponse, { nullable: true })
  async getSearchQueries(
    @Arg('query', { defaultValue: '' }) query: string
  ): Promise<DirectorySearchResponse> {
    return await getSearchQueries(query)
  }

  @Mutation(() => DefaultResponse)
  @UseMiddleware(emailVerified)
  async removeBiolink(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await removeBiolink(id, context, user)
  }

  @Mutation(() => BiolinkResponse)
  @UseMiddleware(emailVerified)
  async importBiolinkDetailsFromLinktreeProfile(
    @Arg('id', { description: 'Biolink ID' }) id: string,
    @Arg('linktreeUsername') linktreeUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await importFromLinktree(id, linktreeUsername, context, user)
  }
}
