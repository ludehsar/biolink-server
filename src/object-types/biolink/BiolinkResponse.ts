import { Biolink } from 'entities'
import { ErrorResponse } from 'object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class BiolinkResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Biolink, { nullable: true })
  biolink?: Biolink
}
