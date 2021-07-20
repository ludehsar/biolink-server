import { Field, InputType } from 'type-graphql'

@InputType()
export class SocialSettingsInput {
  @Field(() => String, { nullable: true })
  youtube!: string

  @Field(() => String, { nullable: true })
  facebook!: string

  @Field(() => String, { nullable: true })
  twitter!: string

  @Field(() => String, { nullable: true })
  instagram!: string
}
