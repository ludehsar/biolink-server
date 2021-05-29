import * as Relay from 'graphql-relay'
import { Field, InputType } from 'type-graphql'

@InputType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => String, {
    nullable: true,
    description: 'Paginate before created at timestamp as opaque cursor',
  })
  before?: Relay.ConnectionCursor

  @Field(() => String, {
    nullable: true,
    description: 'Paginate after created at timestamp as opaque cursor',
  })
  after?: Relay.ConnectionCursor

  @Field(() => String, { defaultValue: '', description: 'Search query' })
  query!: string

  @Field(() => Number, { defaultValue: 10, description: 'Paginate first' })
  first?: number
}
