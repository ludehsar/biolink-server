import { Field, InputType } from 'type-graphql'

@InputType()
export class EmailSettingsInput {
  @Field(() => String, { nullable: true })
  fromName!: string

  @Field(() => String, { nullable: true })
  fromEmail!: string
}
