import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewEmbedInput {
  @Field(() => String, { nullable: true })
  biolinkId?: string

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  linkColor?: string

  @Field(() => GraphQLUpload, { nullable: true })
  linkImage?: FileUpload

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

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  featured?: boolean
}
