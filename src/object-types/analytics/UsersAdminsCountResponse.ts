import { ErrorResponse } from '../../object-types'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
class UsersAdminsCount {
  @Field(() => Int, { nullable: true })
  totalUsers?: number

  @Field(() => Int, { nullable: true })
  totalAdmins?: number
}

@ObjectType()
export class UsersAdminsCountResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => UsersAdminsCount, { nullable: true })
  result?: UsersAdminsCount
}
