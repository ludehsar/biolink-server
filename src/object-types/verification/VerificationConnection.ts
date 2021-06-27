import { Field, ObjectType } from 'type-graphql'

import { VerificationEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class VerificationConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [VerificationEdge], { nullable: true })
  edges?: VerificationEdge[]
}
