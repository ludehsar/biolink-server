import { ObjectType, Field } from 'type-graphql'

import { AuthToken } from './AuthToken'

@ObjectType()
export class AccessAndRefreshToken {
  @Field(() => AuthToken, { nullable: true })
  access?: AuthToken

  @Field(() => AuthToken, { nullable: true })
  refresh?: AuthToken
}
