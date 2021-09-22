import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class ErrorResponse {
  @Field()
  errorCode!: string

  @Field()
  message!: string
}
