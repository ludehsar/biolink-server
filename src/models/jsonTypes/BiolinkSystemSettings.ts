import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BiolinkSystemSettings {
  @Field(() => String, { nullable: true })
  branding!: string

  @Field(() => String, { nullable: true })
  enableLinkShortenerSystem!: string

  @Field(() => String, { nullable: true })
  enableCustomDomainSystem!: string

  @Field(() => String, { nullable: true })
  enableMainDomainUsage!: string

  @Field(() => [String], { nullable: true })
  blacklistedDomains!: string[]

  @Field(() => [String], { nullable: true })
  blacklistedKeywords!: string[]

  @Field(() => String, { nullable: true })
  enablePhishtank!: string

  @Field(() => String, { nullable: true })
  enableGoogleSafeBrowsing!: string
}
