import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { LinkSystemSettings } from '../../json-types'

@ObjectType()
export class LinkSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => LinkSystemSettings, { nullable: true })
  settings?: LinkSystemSettings
}
