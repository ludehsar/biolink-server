import { Field, InputType } from 'type-graphql'

@InputType()
export class ConnectionArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Paginate before created at timestamp as opaque cursor',
  })
  before?: string

  @Field(() => String, {
    nullable: true,
    description: 'Paginate after created at timestamp as opaque cursor',
  })
  after?: string

  @Field(() => String, { defaultValue: '', description: 'Search query' })
  query!: string

  @Field(() => Number, { defaultValue: 10, description: 'Paginate first' })
  first?: number
}
