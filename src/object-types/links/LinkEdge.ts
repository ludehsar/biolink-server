import { Link } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LinkEdge {
  @Field(() => Link)
  node!: Link

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
