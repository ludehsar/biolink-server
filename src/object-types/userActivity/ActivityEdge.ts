import { UserLogs } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ActivityEdge {
  @Field(() => UserLogs)
  node!: UserLogs

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
