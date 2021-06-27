import { Field, ObjectType } from 'type-graphql'

import { UsernameEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class UsernameConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [UsernameEdge], { nullable: true })
  edges?: UsernameEdge[]
}
