import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class SettingsResponse {
  @Field(() => String, { nullable: true })
  title?: string

  @Field(() => String, { nullable: true })
  defaultLanguage?: string

  @Field(() => String, { nullable: true })
  websiteLogo?: string

  @Field(() => String, { nullable: true })
  favicon?: string

  @Field(() => String, { nullable: true })
  defaultTimezone?: string

  @Field(() => String, { nullable: true })
  termsAndConditionsUrl?: string

  @Field(() => String, { nullable: true })
  privacyPolicyUrl?: string
}
