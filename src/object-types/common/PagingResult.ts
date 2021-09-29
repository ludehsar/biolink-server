import { ClassType, Field, ObjectType } from 'type-graphql'

export default function PagingResult<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PagingResultClass {
    @Field(() => [TItemClass])
    data!: TItem[]

    @Field(() => Cursor)
    cursor!: Cursor
  }
  return PagingResultClass
}

@ObjectType()
class Cursor {
  @Field(() => String, { nullable: true })
  beforeCursor!: string | null

  @Field(() => String, { nullable: true })
  afterCursor!: string | null
}
