import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { CaptchaSystemSettings } from '../../json-types'

@ObjectType()
export class CaptchaSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => CaptchaSystemSettings, { nullable: true })
  settings?: CaptchaSystemSettings
}
