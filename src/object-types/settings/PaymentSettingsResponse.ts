import { ErrorResponse } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'
import { PaymentSystemSettings } from '../../json-types'

@ObjectType()
export class PaymentSettingsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => PaymentSystemSettings, { nullable: true })
  settings?: PaymentSystemSettings
}
