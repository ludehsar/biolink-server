import { Code } from '../../entities'
import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class CodeResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Code, { nullable: true })
  code?: Code
}
