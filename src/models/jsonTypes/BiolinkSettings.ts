import { ObjectType, Field } from 'type-graphql'

@ObjectType()
class SocialMediaProps {
  @Field(() => String, { nullable: true })
  platform!: string

  @Field(() => String, { nullable: true })
  link!: string
}

@ObjectType()
export class BiolinkSettings {
  // ----- Dark Mode ----- //
  @Field(() => String, { nullable: true })
  enableDarkMode!: string

  // ----- Contacts ----- //
  @Field(() => String, { nullable: true })
  showEmail!: string

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  showPhone!: string

  @Field(() => String, { nullable: true })
  phone!: string

  @Field(() => String, { nullable: true })
  enableColoredContactButtons!: string

  @Field(() => String, { nullable: true })
  addToDirectory!: string

  // ----- Social Media Icons ----- //
  @Field(() => String, { nullable: true })
  enableColoredSocialMediaIcons!: string

  @Field(() => [SocialMediaProps], { nullable: true })
  socialAccounts!: SocialMediaProps[]

  // ----- Analytics ----- //
  @Field(() => String, { nullable: true })
  enableFacebookPixel!: string

  @Field(() => String, { nullable: true })
  facebookPixelId!: string

  @Field(() => String, { nullable: true })
  enableGoogleAnalytics!: string

  @Field(() => String, { nullable: true })
  googleAnalyticsCode!: string

  // ----- UTM Parameter ----- //
  @Field(() => String, { nullable: true })
  enableUtmParameters!: string

  @Field(() => String, { nullable: true })
  utmSource!: string

  @Field(() => String, { nullable: true })
  utmMedium!: string

  @Field(() => String, { nullable: true })
  utmCampaign!: string

  // ----- SEO ----- //
  @Field(() => String, { nullable: true })
  blockSearchEngineIndexing!: string

  @Field(() => String, { nullable: true })
  pageTitle!: string

  @Field(() => String, { nullable: true })
  metaDescription!: string

  @Field(() => String, { nullable: true })
  opengraphImageUrl!: string

  // ----- Custom Branding ----- //
  @Field(() => String, { nullable: true })
  removeDefaultBranding!: string

  @Field(() => String, { nullable: true })
  enableCustomBranding!: string

  @Field(() => String, { nullable: true })
  customBrandingName!: string

  @Field(() => String, { nullable: true })
  customBrandingUrl!: string

  // ----- Protection ------ //
  @Field(() => String, { nullable: true })
  enablePasswordProtection!: string

  password!: string

  @Field(() => String, { nullable: true })
  enableSensitiveContentWarning!: string
}
