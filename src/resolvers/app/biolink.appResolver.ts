import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { BooleanResponse } from '../../typeDefs/common.typeDef'
import {
  createNewBiolink,
  getAllDirectories,
  getAllUserBiolinks,
  getBiolinkFromUsername,
  importFromLinktree,
  removeBiolinkByUsername,
  sortBiolinkLinks,
  updateBiolinkFromUsername,
  updateBrandingSettings,
  updateContactButtonSettings,
  updateDarkModeOptions,
  updateDirectorySettings,
  updateIntegrationSettings,
  updatePrivacySettings,
  updateSEOSettings,
  updateSocialAccountsSettings,
  updateUTMParameterSettings,
  uploadBiolinkCoverPhoto,
  uploadBiolinkProfilePhoto,
} from '../../controllers/app/biolink.controller'
import { MyContext } from 'MyContext'
import { ConnectionArgs } from '../../typeDefs/relaySpec.typeDef'
import {
  BiolinkResponse,
  NewBiolinkInput,
  UpdateBiolinkProfileInput,
  BiolinkConnection,
  ContactButtonInput,
  DarkModeInput,
  SocialAccountsInput,
  IntegrationInput,
  UTMParameterInput,
  SEOInput,
  BrandingInput,
  PrivacyInput,
  DirectoryInput,
  SortedLinksInput,
  BiolinkListResponse,
} from '../../typeDefs/biolink.typeDef'
import { FileUpload, GraphQLUpload } from 'graphql-upload'

@Resolver()
export class BiolinkResolver {
  @Mutation(() => BiolinkResponse)
  async createNewBiolink(
    @Arg('options') options: NewBiolinkInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createNewBiolink(options, context, user)
  }

  @Query(() => BiolinkResponse)
  async getBiolinkFromUsername(
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await getBiolinkFromUsername(username, context, user)
  }

  @Query(() => BiolinkListResponse)
  async getAllUserBiolinks(@CurrentUser() user: User): Promise<BiolinkListResponse> {
    return await getAllUserBiolinks(user)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkFromUsername(user, username, options, context)
  }

  @Mutation(() => BiolinkResponse)
  async updateDarkModeOptionsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: DarkModeInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateDarkModeOptions(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateContactButtonSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: ContactButtonInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateContactButtonSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateSocialAccountsSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: SocialAccountsInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateSocialAccountsSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateIntegrationSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: IntegrationInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateIntegrationSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateUTMParameterSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: UTMParameterInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateUTMParameterSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateSEOSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: SEOInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateSEOSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateBrandingSettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: BrandingInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBrandingSettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updatePrivacySettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: PrivacyInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updatePrivacySettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async uploadBiolinkProfilePhoto(
    @Arg('username') username: string,
    @Arg('profilePhoto', () => GraphQLUpload) profilePhoto: FileUpload,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await uploadBiolinkProfilePhoto(username, profilePhoto, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async uploadBiolinkCoverPhoto(
    @Arg('username') username: string,
    @Arg('coverPhoto', () => GraphQLUpload) coverPhoto: FileUpload,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await uploadBiolinkCoverPhoto(username, coverPhoto, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async updateDirectorySettingsByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: DirectoryInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateDirectorySettings(username, options, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async sortBiolinkLinksByBiolinkUsername(
    @Arg('username') username: string,
    @Arg('options') options: SortedLinksInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await sortBiolinkLinks(username, options, context, user)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryId', { defaultValue: 0 }) categoryId: number
  ): Promise<BiolinkConnection> {
    return await getAllDirectories(categoryId, options)
  }

  @Mutation(() => BooleanResponse)
  async deleteBiolinkByUsername(
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await removeBiolinkByUsername(username, context, user)
  }

  @Mutation(() => BiolinkResponse)
  async importBiolinkDetailsFromLinktreeProfile(
    @Arg('username') username: string,
    @Arg('linktreeUsername') linktreeUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await importFromLinktree(username, linktreeUsername, context, user)
  }
}
