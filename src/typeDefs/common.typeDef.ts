import { ObjectType, Field, InputType, Int } from 'type-graphql'

@ObjectType()
export class ErrorResponse {
  @Field(() => Int)
  errorCode!: number

  @Field()
  field?: string

  @Field()
  message!: string
}

@ObjectType()
export class BooleanResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

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
}
