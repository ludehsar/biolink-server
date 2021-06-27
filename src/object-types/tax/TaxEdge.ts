import { Tax } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TaxEdge {
  @Field(() => Tax)
  node!: Tax

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
