import { ReferralEdge, ErrorResponse, PageInfo } from '../../object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ReferralConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [ReferralEdge], { nullable: true })
  edges?: ReferralEdge[]
}
