import { Payment } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaymentEdge {
  @Field(() => Payment)
  node!: Payment

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
