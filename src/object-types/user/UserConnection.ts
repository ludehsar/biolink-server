import { Field, ObjectType } from 'type-graphql'

import { UserEdge, PageInfo, ErrorResponse } from '../../object-types'

@ObjectType()
export class UserConnection {
  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [UserEdge], { nullable: true })
  edges?: UserEdge[]

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]
}
