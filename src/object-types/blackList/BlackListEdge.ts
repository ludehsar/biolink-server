import { BlackList } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BlackListEdge {
  @Field(() => BlackList)
  node!: BlackList

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
