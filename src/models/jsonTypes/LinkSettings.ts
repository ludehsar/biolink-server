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

  @Field(() => Boolean, { nullable: true })
  customBackHalfEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  noAdsEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  removableBrandingEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  customFooterBrandingEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  coloredLinksEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  googleAnalyticsEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  facebookPixelEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  customBackgroundEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  linksSchedulingEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  seoEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  socialEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  utmParametersEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  passwordProtectionEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  sensitiveContentWarningEnabled!: boolean

  @Field(() => Boolean, { nullable: true })
  leapLinkEnabled!: boolean
}
