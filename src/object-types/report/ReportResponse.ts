import { Report } from '../../entities'
import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class ReportResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Report, { nullable: true })
  report?: Report
}
