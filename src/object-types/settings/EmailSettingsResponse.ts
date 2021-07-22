import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { EmailSystemSettings } from '../../json-types'

@ObjectType()
export class EmailSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => EmailSystemSettings, { nullable: true })
  settings?: EmailSystemSettings
}
