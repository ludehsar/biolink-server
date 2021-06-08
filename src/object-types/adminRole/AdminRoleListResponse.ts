import { AdminRole } from '../../entities'
import { ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class AdminRoleListResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [AdminRole], { nullable: true })
  adminRoles?: AdminRole[]
}
