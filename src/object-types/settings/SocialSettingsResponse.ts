import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { SocialSystemSettings } from '../../json-types'

@ObjectType()
export class SocialSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => SocialSystemSettings, { nullable: true })
  settings?: SocialSystemSettings
}
