import { Plan } from '../../entities'
import { ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class PlanListResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [Plan], { nullable: true })
  plans?: Plan[]
}
