import { ErrorResponse, SingleLinkClickCount } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class LinkClicksResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [SingleLinkClickCount], { nullable: true })
  result?: SingleLinkClickCount[]
}
