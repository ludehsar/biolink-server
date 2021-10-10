import { InputType, Field } from 'type-graphql'

@InputType()
export class NewSocialLinkInput {
  @Field(() => String, { nullable: true })
  biolinkId?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  linkColor?: string

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => String, { nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  endDate?: Date

  @Field(() => Boolean, { defaultValue: false })
  enablePasswordProtection!: boolean

  @Field(() => String, { nullable: true })
  password?: string

  @Field(() => String, { nullable: true })
  platform?: string

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  featured?: boolean
}
