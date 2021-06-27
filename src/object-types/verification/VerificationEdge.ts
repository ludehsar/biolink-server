import { Verification } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class VerificationEdge {
  @Field(() => Verification)
  node!: Verification

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
