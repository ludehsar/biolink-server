import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Cursor {
  @Field(() => String, { nullable: true })
  beforeCursor!: string | null

  @Field(() => String, { nullable: true })
  afterCursor!: string | null
}
