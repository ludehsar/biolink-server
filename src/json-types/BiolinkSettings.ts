import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class SocialMediaProps {
  @Field(() => String, { nullable: true })
  platform!: string

  @Field(() => String, { nullable: true })
  icon?: string

  @Field(() => String, { nullable: true })
  link!: string
}

@ObjectType()
export class BiolinkSettings {
  // ----- Dark Mode ----- //
  @Field(() => Boolean, { nullable: true })
  enableDarkMode!: boolean

  // ----- Contacts ----- //
  @Field(() => Boolean, { nullable: true })
  showEmail!: boolean

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => Boolean, { nullable: true })
  showPhone!: boolean

  @Field(() => String, { nullable: true })
  phone!: string

  @Field(() => Boolean, { nullable: true })
  enableColoredContactButtons!: boolean

  // ----- Directory Settings ----- //
  @Field(() => Boolean, { nullable: true })
  addedToDirectory!: boolean

  @Field(() => String, { nullable: true })
  directoryBio!: string

  // ----- Social Media Icons ----- //
  @Field(() => Boolean, { nullable: true })
  enableColoredSocialMediaIcons!: boolean

  @Field(() => [SocialMediaProps], { nullable: true })
  socialAccounts!: SocialMediaProps[]

  // ----- Analytics ----- //
  @Field(() => Boolean, { nullable: true })
  enableFacebookPixel!: boolean

  @Field(() => String, { nullable: true })
  facebookPixelId!: string

  @Field(() => Boolean, { nullable: true })
  enableGoogleAnalytics!: boolean

  @Field(() => String, { nullable: true })
  googleAnalyticsCode!: string

  @Field(() => Boolean, { nullable: true })
  enableEmailCapture!: boolean

  @Field(() => String, { nullable: true })
  emailCaptureId!: string

  // ----- UTM Parameter ----- //
  @Field(() => Boolean, { nullable: true })
  enableUtmParameters!: boolean

  @Field(() => String, { nullable: true })
  utmSource!: string

  @Field(() => String, { nullable: true })
  utmMedium!: string

  @Field(() => String, { nullable: true })
  utmCampaign!: string

  // ----- SEO ----- //
  @Field(() => Boolean, { nullable: true })
  blockSearchEngineIndexing!: boolean

  @Field(() => String, { nullable: true })
  pageTitle!: string

  @Field(() => String, { nullable: true })
  metaDescription!: string

  @Field(() => String, { nullable: true })
  opengraphImageUrl!: string

  // ----- Custom Branding ----- //
  @Field(() => Boolean, { nullable: true })
  removeDefaultBranding!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCustomBranding!: boolean

  @Field(() => String, { nullable: true })
  customBrandingName!: string

  @Field(() => String, { nullable: true })
  customBrandingUrl!: string

  // ----- Protection ------ //
  @Field(() => Boolean, { nullable: true })
  enablePasswordProtection!: boolean

  password!: string

  @Field(() => Boolean, { nullable: true })
  enableSensitiveContentWarning!: boolean
}
