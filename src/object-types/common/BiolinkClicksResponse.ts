import { SingleBiolinkClickCount } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class BiolinkClicksResponse {
  @Field(() => SingleBiolinkClickCount, { nullable: true })
  result?: SingleBiolinkClickCount
}
