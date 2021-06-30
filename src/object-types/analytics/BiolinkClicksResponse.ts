import { ErrorResponse, SingleBiolinkClickCount } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class BiolinkClicksResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => SingleBiolinkClickCount, { nullable: true })
  result?: SingleBiolinkClickCount
}
