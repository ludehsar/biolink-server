import { IsNotEmpty, Matches, IsInt, IsUrl, IsIn, IsEmail, IsPhoneNumber } from 'class-validator'
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { Biolink } from '../models/entities/Biolink'
import CurrentUser from '../decorators/currentUser'
import { User } from '../models/entities/User'
import { FieldError } from './commonTypes'
import {
  createNewBiolink,
  getBiolinkFromUsername,
  removeBiolinkByUsername,
  updateBiolinkFromUsername,
  updateBiolinkSettingsFromUsername,
} from '../services/biolink.service'

@InputType()
export class SingleSocialAccount {
  @Field()
  @IsNotEmpty()
  platform?: string

  @Field()
  @IsNotEmpty()
  @IsUrl()
  link?: string
}

@InputType()
export class NewBiolinkInput {
  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username?: string

  @Field()
  @IsNotEmpty()
  @IsInt()
  categoryId?: number
}

@InputType()
export class UpdateBiolinkProfileInput {
  @Field({ nullable: true })
  displayName?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  bio?: string
}

@InputType()
export class UpdateBiolinkSettingsInput {
  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableDarkMode?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  showEmail?: string

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  showPhone?: string

  @Field({ nullable: true })
  @IsPhoneNumber()
  phone?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableColoredContactButtons?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  addToDirectory?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableColoredSocialMediaIcons?: string

  @Field(() => [SingleSocialAccount], { nullable: true, defaultValue: [] })
  socialAccounts?: SingleSocialAccount[]

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableFacebookPixel?: string

  @Field({ nullable: true })
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableGoogleAnalytics?: string

  @Field({ nullable: true })
  googleAnalyticsCode?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableUtmParameters?: string

  @Field({ nullable: true })
  utmSource?: string

  @Field({ nullable: true })
  utmMedium?: string

  @Field({ nullable: true })
  utmCampaign?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  blockSearchEngineIndexing?: string

  @Field({ nullable: true })
  pageTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field({ nullable: true })
  opengraphImageUrl?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  removeDefaultBranding?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableCustomBranding?: string

  @Field({ nullable: true })
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  customBrandingUrl?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enablePasswordProtection?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true, defaultValue: 'no' })
  @IsIn(['yes', 'no'])
  enableSensitiveContentWarning?: string
}

@ObjectType()
export class BiolinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Biolink, { nullable: true })
  biolink?: Biolink
}

@Resolver()
export class BiolinkResolver {
  @Mutation(() => BiolinkResponse)
  async createNewBiolink(
    @Arg('options') options: NewBiolinkInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createNewBiolink(options, user)
  }

  @Query(() => BiolinkResponse)
  async getBiolinkFromUsername(@Arg('username') username: string): Promise<BiolinkResponse> {
    return await getBiolinkFromUsername(username)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkFromUsername(user, username, options)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkSettingsFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkSettingsInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkSettingsFromUsername(user, username, options)
  }

  @Mutation(() => Boolean)
  async deleteBiolink(
    @Arg('username') username: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return await removeBiolinkByUsername(username, user)
  }
}
