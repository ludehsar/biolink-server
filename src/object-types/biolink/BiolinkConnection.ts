import { BiolinkEdge, PageInfo } from 'object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BiolinkConnection {
  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => [BiolinkEdge])
  edges!: BiolinkEdge[]
}
