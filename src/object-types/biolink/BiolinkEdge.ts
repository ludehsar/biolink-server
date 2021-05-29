import { Biolink } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BiolinkEdge {
  @Field(() => Biolink)
  node!: Biolink

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
