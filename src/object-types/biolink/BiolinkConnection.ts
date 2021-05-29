import { Field, ObjectType } from 'type-graphql'

import { BiolinkEdge, PageInfo } from '../../object-types'

@ObjectType()
export class BiolinkConnection {
  @Field(() => PageInfo)
  pageInfo!: PageInfo

  @Field(() => [BiolinkEdge])
  edges!: BiolinkEdge[]
}
