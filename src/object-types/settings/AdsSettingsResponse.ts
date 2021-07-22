import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { AdsSystemSettings } from '../../json-types'

@ObjectType()
export class AdsSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => AdsSystemSettings, { nullable: true })
  settings?: AdsSystemSettings
}
