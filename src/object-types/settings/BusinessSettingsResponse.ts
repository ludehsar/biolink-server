import { ObjectType, Field } from 'type-graphql'
import { ErrorResponse } from '../../object-types'
import { BusinessSystemSettings } from '../../json-types'

@ObjectType()
export class BusinessSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => BusinessSystemSettings, { nullable: true })
  settings?: BusinessSystemSettings
}
