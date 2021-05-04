import { Stream } from 'stream'
import { ObjectType, Field, InputType } from 'type-graphql'

@ObjectType()
export class FieldError {
  @Field({ nullable: true })
  field?: string

  @Field()
  message!: string
}

@ObjectType()
export class BooleanResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Boolean, { nullable: true })
  executed!: boolean
}

@InputType()
export class FileType {
  @Field()
  filename!: string

  @Field()
  mimetype!: string

  @Field()
  encoding!: string

  @Field(() => Stream)
  createReadStream!: () => Stream
}
