import { ClassType, Field, ObjectType } from 'type-graphql'
import { Cursor } from './Cursor'

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
