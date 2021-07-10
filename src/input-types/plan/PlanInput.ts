import { InputType, Field, Float, Int } from 'type-graphql'

@InputType()
export class PlanInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Float, { defaultValue: 0.0, nullable: true })
  monthlyPrice?: number

  @Field(() => String, { nullable: true })
  monthlyPriceStripeId?: string

  @Field(() => Float, { defaultValue: 0.0, nullable: true })
  annualPrice?: number

  @Field(() => String, { nullable: true })
  annualPriceStripeId?: string

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  visibilityStatus?: boolean

  // Settings
  @Field(() => Int, { nullable: true })
  totalBiolinksLimit?: number

  @Field(() => Int, { nullable: true })
  totalLinksLimit?: number

  @Field(() => Int, { nullable: true })
  totalCustomDomainLimit?: number

  @Field(() => Boolean, { nullable: true })
  darkModeEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  addedToDirectoryEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  customBackHalfEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  noAdsEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  removableBrandingEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  customFooterBrandingEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  coloredLinksEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  googleAnalyticsEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  facebookPixelEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  emailCaptureEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  verifiedCheckmarkEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  linksSchedulingEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  seoEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  socialEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  utmParametersEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  passwordProtectionEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  sensitiveContentWarningEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  leapLinkEnabled?: boolean

  @Field(() => Boolean, { nullable: true })
  enableDonationLink?: boolean
}
