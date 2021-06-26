import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class DirectorySearchResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [String], { nullable: true })
  results?: string[]
}
