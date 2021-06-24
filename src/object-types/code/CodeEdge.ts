import { Code } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CodeEdge {
  @Field(() => Code)
  node!: Code

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
