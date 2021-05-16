import {
  IsNotEmpty,
  Matches,
  IsInt,
  IsUrl,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { Biolink } from '../models/entities/Biolink'
import CurrentUser from '../decorators/currentUser'
import { User } from '../models/entities/User'
import { BooleanResponse, FieldError } from './commonTypes'
import {
  createNewBiolink,
  getAllDirectories,
  getBiolinkFromUsername,
  removeBiolinkByUsername,
  updateBiolinkFromUsername,
  updateBiolinkSettingsFromUsername,
} from '../services/biolink.service'
import { MyContext } from 'MyContext'
import { EdgeType, ConnectionType, ConnectionArgs } from './relaySpec'

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
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableDarkMode?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  showEmail?: boolean

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  showPhone?: boolean

  @Field({ nullable: true })
  @IsPhoneNumber()
  phone?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableColoredContactButtons?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  addedToDirectory?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableColoredSocialMediaIcons?: boolean

  @Field(() => [SingleSocialAccount], { nullable: true, defaultValue: [] })
  socialAccounts?: SingleSocialAccount[]

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableFacebookPixel?: boolean

  @Field({ nullable: true })
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableGoogleAnalytics?: boolean

  @Field({ nullable: true })
  googleAnalyticsCode?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableUtmParameters?: boolean

  @Field({ nullable: true })
  utmSource?: string

  @Field({ nullable: true })
  utmMedium?: string

  @Field({ nullable: true })
  utmCampaign?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  blockSearchEngineIndexing?: boolean

  @Field({ nullable: true })
  pageTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field({ nullable: true })
  opengraphImageUrl?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  removeDefaultBranding?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableCustomBranding?: boolean

  @Field({ nullable: true })
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  customBrandingUrl?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enablePasswordProtection?: boolean

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableSensitiveContentWarning?: boolean
}

@ObjectType()
export class BiolinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Biolink, { nullable: true })
  biolink?: Biolink
}

@ObjectType()
export class BiolinkEdge extends EdgeType('category', Biolink) {}

@ObjectType()
export class BiolinkConnection extends ConnectionType<BiolinkEdge>('category', BiolinkEdge) {}

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
  async updateBiolinkSettingsFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkSettingsInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkSettingsFromUsername(user, username, options, context)
  }

  @Query(() => BiolinkConnection, { nullable: true })
  async getAllDirectories(
    @Arg('options') options: ConnectionArgs,
    @Arg('categoryId', { defaultValue: 0 }) categoryId: number
  ): Promise<BiolinkConnection> {
    return await getAllDirectories(categoryId, options)
  }

  @Mutation(() => BooleanResponse)
  async deleteBiolink(
    @Arg('username') username: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await removeBiolinkByUsername(username, context, user)
  }
}
