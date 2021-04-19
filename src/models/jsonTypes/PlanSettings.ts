import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class PlanSettings {
  @Field(() => Int, { nullable: true })
  totalProjectsLimit!: number

  @Field(() => Int, { nullable: true })
  totalBiolinksLimit!: number

  @Field(() => Int, { nullable: true })
  totalLinksLimit!: number

  @Field(() => Int, { nullable: true })
  totalCustomDomainLimit!: number

  @Field(() => String, { nullable: true })
  customBackHalfEnabled!: string

  @Field(() => String, { nullable: true })
  noAdsEnabled!: string

  @Field(() => String, { nullable: true })
  removableBrandingEnabled!: string

  @Field(() => String, { nullable: true })
  customFooterBrandingEnabled!: string

  @Field(() => String, { nullable: true })
  coloredLinksEnabled!: string

  @Field(() => String, { nullable: true })
  googleAnalyticsEnabled!: string

  @Field(() => String, { nullable: true })
  facebookPixelEnabled!: string

  @Field(() => String, { nullable: true })
  customBackgroundEnabled!: string

  @Field(() => String, { nullable: true })
  verifiedCheckmarkEnabled!: string

  @Field(() => String, { nullable: true })
  linksSchedulingEnabled!: string

  @Field(() => String, { nullable: true })
  seoEnabled!: string

  @Field(() => String, { nullable: true })
  socialEnabled!: string

  @Field(() => String, { nullable: true })
  utmParametersEnabled!: string

  @Field(() => String, { nullable: true })
  passwordProtectionEnabled!: string

  @Field(() => String, { nullable: true })
  sensitiveContentWarningEnabled!: string

  @Field(() => String, { nullable: true })
  leapLinkEnabled!: string
}
