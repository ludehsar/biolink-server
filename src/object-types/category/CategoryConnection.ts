import { CategoryEdge, ErrorResponse, PageInfo } from '../../object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CategoryConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [CategoryEdge], { nullable: true })
  edges?: CategoryEdge[]
}
