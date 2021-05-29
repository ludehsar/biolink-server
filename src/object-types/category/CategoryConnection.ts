import { CategoryEdge, PageInfo } from 'object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CategoryConnection {
  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => [CategoryEdge])
  edges!: CategoryEdge[]
}
