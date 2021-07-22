import { IsBoolean, IsOptional, IsUrl, ValidateIf } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { Field, InputType } from 'type-graphql'

@InputType()
export class MainSettingsInput {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  defaultLanguage?: string

  @Field(() => GraphQLUpload, { nullable: true })
  websiteLogo?: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  faviconLogo?: FileUpload

  @Field(() => String, { nullable: true })
  defaultTimezone?: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableEmailConfirmation?: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableNewUserRegistration?: boolean

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  @ValidateIf((e) => e.termsAndConditionsUrl !== '')
  termsAndConditionsUrl?: string

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  @ValidateIf((e) => e.privacyPolicyUrl !== '')
  privacyPolicyUrl?: string
}
