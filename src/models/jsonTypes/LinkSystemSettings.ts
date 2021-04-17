import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LinkSystemSettings {
  @Field(() => String, { nullable: true })
  branding!: string

  @Field(() => Boolean, { nullable: true })
  enableLinkShortenerSystem!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCustomDomainSystem!: boolean

  @Field(() => Boolean, { nullable: true })
  enableMainDomainUsage!: boolean

  @Field(() => [String], { nullable: true })
  blacklistedDomains!: string[]

  @Field(() => [String], { nullable: true })
  blacklistedKeywords!: string[]

  @Field(() => Boolean, { nullable: true })
  enablePhishtank!: boolean

  @Field(() => Boolean, { nullable: true })
  enableGoogleSafeBrowsing!: boolean
}
