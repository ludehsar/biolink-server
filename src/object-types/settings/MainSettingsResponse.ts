import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { MainSystemSettings } from '../../json-types'

@ObjectType()
export class MainSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => MainSystemSettings, { nullable: true })
  settings?: MainSystemSettings
}
