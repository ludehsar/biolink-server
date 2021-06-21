import { ErrorResponse, LinkEdge, PageInfo } from '../../object-types'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LinkConnection {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo

  @Field(() => [LinkEdge], { nullable: true })
  edges?: LinkEdge[]
}
