import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsUrl, ValidateIf } from 'class-validator'
import { Field, InputType } from 'type-graphql'

import { SocialAccountStyleType, VerificationStatus } from '../../enums'

@InputType()
export class BiolinkAdminInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.bio !== '')
  bio?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.categoryId !== '')
  categoryId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  changedUsername?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.city !== '')
  city?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.country !== '')
  country?: string

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  coverPhoto?: FileUpload

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.displayName !== '')
  displayName?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  profilePhoto?: FileUpload

  /* ============ Settings ============= */
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  removeDefaultBranding?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCustomBranding?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.customBrandingName !== '')
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  @ValidateIf((e) => e.customBrandingUrl !== '')
  customBrandingUrl?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showEmail?: boolean

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  email?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showPhone?: boolean

  @Field({ nullable: true })
  // @IsPhoneNumber()
  @IsOptional()
  @ValidateIf((e) => e.phone !== '')
  phone?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredContactButtons?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableDarkMode?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  addedToDirectory?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.directoryBio !== '')
  directoryBio?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.paypalLink !== '')
  paypalLink?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.venmoLink !== '')
  venmoLink?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.payoneerLink !== '')
  payoneerLink?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableFacebookPixel?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.facebookPixelId !== '')
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableGoogleAnalytics?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.googleAnalyticsCode !== '')
  googleAnalyticsCode?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableEmailCapture?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.emailCaptureId !== '')
  emailCaptureId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enablePasswordProtection?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.password !== '')
  password?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableSensitiveContentWarning?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  blockSearchEngineIndexing?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.pageTitle !== '')
  pageTitle?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.metaDescription !== '')
  metaDescription?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.opengraphImageUrl !== '')
  opengraphImageUrl?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredSocialMediaIcons?: boolean

  @Field({ nullable: true, defaultValue: SocialAccountStyleType.Round })
  @IsEnum(SocialAccountStyleType)
  @IsOptional()
  socialAccountStyleType?: SocialAccountStyleType

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableUtmParameters?: boolean

  @Field({ nullable: true })
  @IsOptional()
  utmSource?: string

  @Field({ nullable: true })
  @IsOptional()
  utmMedium?: string

  @Field({ nullable: true })
  @IsOptional()
  utmCampaign?: string
  /* ========= End Settings ============ */

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.state !== '')
  state?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.userId !== '')
  userId?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.username !== '')
  username?: string

  @Field(() => String, { nullable: true, defaultValue: VerificationStatus.NotApplied })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  verifiedEmail?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  verifiedGovernmentId?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  verifiedPhoneNumber?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  verifiedWorkEmail?: boolean
}
