import { User } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class UserEdge {
  @Field(() => User)
  node!: User

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
