import { Field, InputType } from 'type-graphql'

@InputType()
export class ConnectionArgs {
  @Field(() => String, {
    nullable: true,
  })
  beforeCursor?: string

  @Field(() => String, {
    nullable: true,
  })
  afterCursor?: string

  @Field(() => String, { nullable: true, defaultValue: '', description: 'Search query' })
  query!: string

  @Field(() => Number, {
    defaultValue: 10,
    nullable: true,
  })
  limit!: number

  @Field(() => String, {
    defaultValue: 'ASC',
    nullable: true,
  })
  order!: 'ASC' | 'DESC'
}
