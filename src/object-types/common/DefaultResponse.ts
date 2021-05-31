import { ObjectType, Field } from 'type-graphql'
import { ErrorResponse } from '../../object-types'

@ObjectType()
export class DefaultResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]
}
