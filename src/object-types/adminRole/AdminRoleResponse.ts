import { AdminRole } from '../../entities'
import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class AdminRoleResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [AdminRole], { nullable: true })
  adminRoles?: AdminRole[]
}
