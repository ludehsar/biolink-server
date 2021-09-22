import { User } from '../../entities'
import { ObjectType, Field } from 'type-graphql'
import { AuthToken } from './AuthToken'

@ObjectType()
export class UserWithTokens {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => AuthToken, { nullable: true })
  access?: AuthToken

  @Field(() => AuthToken, { nullable: true })
  refresh?: AuthToken
}
