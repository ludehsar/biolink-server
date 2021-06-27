import { Report } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ReportEdge {
  @Field(() => Report)
  node!: Report

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
