import { ObjectType, Field } from 'type-graphql'

import { Plan } from '../models/entities/Plan'
import { ErrorResponse } from './common.typeDef'

@ObjectType()
export class PlanResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [Plan], { nullable: true })
  plans?: Plan[]
}
