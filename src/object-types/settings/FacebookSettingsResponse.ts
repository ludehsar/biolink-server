import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { FacebookSystemSettings } from '../../json-types'

@ObjectType()
export class FacebookSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => FacebookSystemSettings, { nullable: true })
  settings?: FacebookSystemSettings
}
