import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { NotificationSystemSettings } from '../../json-types'

@ObjectType()
export class NotificationSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => NotificationSystemSettings, { nullable: true })
  settings?: NotificationSystemSettings
}
