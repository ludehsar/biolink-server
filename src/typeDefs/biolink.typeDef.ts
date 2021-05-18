import { InputType, Field, ObjectType } from 'type-graphql'
import {
  IsNotEmpty,
  IsUrl,
  Matches,
  IsInt,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator'

import { Biolink } from '../models/entities/Biolink'
import { FieldError } from './common.typeDef'
import { EdgeType, ConnectionType } from './relaySpec.typeDef'

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
