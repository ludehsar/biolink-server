import { Field, ObjectType } from 'type-graphql'

import { TaxEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class TaxConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [TaxEdge], { nullable: true })
  edges?: TaxEdge[]
}
