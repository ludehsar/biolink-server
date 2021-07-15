import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewMessageInput {
  @Field(() => String, { nullable: true })
  message?: string

  @Field(() => GraphQLUpload, { nullable: true })
  attachment?: FileUpload
}
