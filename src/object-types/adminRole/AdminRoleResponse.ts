import { AdminRole } from '../../entities'
import { ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class AdminRoleResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => AdminRole, { nullable: true })
  adminRole?: AdminRole
}
