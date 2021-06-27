import { Field, ObjectType } from 'type-graphql'

import { SupportEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class SupportConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [SupportEdge], { nullable: true })
  edges?: SupportEdge[]
}
