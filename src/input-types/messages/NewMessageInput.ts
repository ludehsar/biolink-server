import { InputType, Field } from 'type-graphql'

@InputType()
export class NewMessageInput {
  @Field(() => String, { nullable: true })
  message?: string
}
