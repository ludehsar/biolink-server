import { InputType, Field } from 'type-graphql'

@InputType()
export class NewLinkInput {
  @Field(() => String, { defaultValue: 'Link' })
  linkType?: string

  @Field(() => String)
  url!: string

  @Field(() => String, { nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => String, { nullable: true })
  shortenedUrl?: string

  @Field(() => String, { nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  endDate?: Date

  @Field(() => Boolean, { defaultValue: false })
  enablePasswordProtection!: boolean

  @Field(() => String, { nullable: true })
  password?: string
}
