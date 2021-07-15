import { Message } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class MessageEdge {
  @Field(() => Message)
  node!: Message

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
