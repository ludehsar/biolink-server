import { CodeEdge, ErrorResponse, PageInfo } from '../../object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CodeConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [CodeEdge], { nullable: true })
  edges?: CodeEdge[]
}
