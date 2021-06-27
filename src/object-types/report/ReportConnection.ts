import { Field, ObjectType } from 'type-graphql'

import { ReportEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class ReportConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [ReportEdge], { nullable: true })
  edges?: ReportEdge[]
}
