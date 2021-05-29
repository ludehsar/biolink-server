import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class ErrorResponse {
  @Field(() => Int)
  errorCode!: number

  @Field({ nullable: true })
  field?: string

  @Field()
  message!: string
}
