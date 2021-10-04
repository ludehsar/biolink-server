import { Cursor, SingleLinkClickCount } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class LinkClicksResponse {
  @Field(() => [SingleLinkClickCount], { nullable: true })
  result?: SingleLinkClickCount[]

  @Field(() => Cursor)
  cursor!: Cursor
}
