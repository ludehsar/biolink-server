import { ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class FollowingResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Boolean, { nullable: true })
  following?: boolean
}
