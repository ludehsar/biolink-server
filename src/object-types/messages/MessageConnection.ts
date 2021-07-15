import { ErrorResponse, MessageEdge, PageInfo } from '../../object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class MessageConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [MessageEdge], { nullable: true })
  edges?: MessageEdge[]
}
