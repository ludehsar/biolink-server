import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class PrivacyInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enablePasswordProtection?: boolean

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableSensitiveContentWarning?: boolean
}
