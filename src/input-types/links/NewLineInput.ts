import { InputType, Field } from 'type-graphql'

@InputType()
export class NewLineInput {
  @Field(() => String, { nullable: true })
  biolinkId?: string

  @Field(() => String, { nullable: true })
  linkColor?: string
}
