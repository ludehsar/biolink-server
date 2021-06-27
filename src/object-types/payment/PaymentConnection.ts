import { Field, ObjectType } from 'type-graphql'

import { PaymentEdge, ErrorResponse, PageInfo } from '../../object-types'

@ObjectType()
export class PaymentConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [PaymentEdge], { nullable: true })
  edges?: PaymentEdge[]
}
