import { Link } from 'entities'
import { ErrorResponse } from 'object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class LinkResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Link, { nullable: true })
  link?: Link
}
