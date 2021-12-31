import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class UsersAdminsCountResponse {
  @Field(() => Int, { nullable: true })
  totalUsers?: number

  @Field(() => Int, { nullable: true })
  totalAdmins?: number
}
