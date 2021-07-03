import { Support } from '../../entities'
import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class SupportResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Support, { nullable: true })
  support?: Support
}
