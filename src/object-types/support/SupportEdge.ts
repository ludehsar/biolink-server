import { Support } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SupportEdge {
  @Field(() => Support)
  node!: Support

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
