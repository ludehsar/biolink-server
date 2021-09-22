import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class AuthToken {
  @Field(() => String, { nullable: true })
  token?: string

  @Field(() => Int, { nullable: true })
  expires?: number
}
