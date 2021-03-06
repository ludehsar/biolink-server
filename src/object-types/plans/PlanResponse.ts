import { Plan } from '../../entities'
import { ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class PlanResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Plan, { nullable: true })
  plan?: Plan
}
