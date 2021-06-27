import { Username } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class UsernameEdge {
  @Field(() => Username)
  node!: Username

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
