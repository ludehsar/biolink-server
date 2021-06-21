import { Field, ObjectType } from 'type-graphql'

import { BiolinkEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class BiolinkConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [BiolinkEdge], { nullable: true })
  edges?: BiolinkEdge[]
}
