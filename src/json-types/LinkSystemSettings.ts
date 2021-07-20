import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LinkSystemSettings {
  @Field(() => String, { nullable: true })
  branding!: string

  @Field(() => Boolean, { nullable: true })
  enableLinkShortenerSystem!: boolean

  @Field(() => Boolean, { nullable: true })
  enablePhishtank!: boolean

  @Field(() => Boolean, { nullable: true })
  enableGoogleSafeBrowsing!: boolean
}
