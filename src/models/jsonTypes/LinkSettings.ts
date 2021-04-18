import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class LinkSettings {
  @Field(() => Int, { nullable: true })
  totalProjectsLimit!: number

  @Field(() => Int, { nullable: true })
  totalBiolinksLimit!: number

  @Field(() => Int, { nullable: true })
  totalLinksLimit!: number

  @Field(() => Int, { nullable: true })
  totalCustomDomainLimit!: number

  @Field(() => Int, { nullable: true })
  customBackHalfEnabled!: number

  @Field(() => Int, { nullable: true })
  noAdsEnabled!: number

  @Field(() => Int, { nullable: true })
  removableBrandingEnabled!: number

  @Field(() => Int, { nullable: true })
  customFooterBrandingEnabled!: number

  @Field(() => Int, { nullable: true })
  coloredLinksEnabled!: number

  @Field(() => Int, { nullable: true })
  googleAnalyticsEnabled!: number

  @Field(() => Int, { nullable: true })
  facebookPixelEnabled!: number

  @Field(() => Int, { nullable: true })
  customBackgroundEnabled!: number

  @Field(() => Int, { nullable: true })
  linksSchedulingEnabled!: number

  @Field(() => Int, { nullable: true })
  seoEnabled!: number

  @Field(() => Int, { nullable: true })
  socialEnabled!: number

  @Field(() => Int, { nullable: true })
  utmParametersEnabled!: number

  @Field(() => Int, { nullable: true })
  passwordProtectionEnabled!: number

  @Field(() => Int, { nullable: true })
  sensitiveContentWarningEnabled!: number

  @Field(() => Int, { nullable: true })
  leapLinkEnabled!: number
}
