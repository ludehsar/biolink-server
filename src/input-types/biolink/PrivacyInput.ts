import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class PrivacyInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enablePasswordProtection?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.password !== '')
  password?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableSensitiveContentWarning?: boolean
}
