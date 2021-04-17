import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class MainSystemSettings {
  @Field(() => String, { nullable: true })
  title!: string

  @Field(() => String, { nullable: true })
  defaultLanguage!: string

  @Field(() => String, { nullable: true })
  websiteLogoUrl!: string

  @Field(() => String, { nullable: true })
  faviconLogoUrl!: string

  @Field(() => String, { nullable: true })
  defaultTimezone!: string

  @Field(() => Boolean, { nullable: true })
  enableEmailConfirmation!: boolean

  @Field(() => Boolean, { nullable: true })
  enableNewUserRegistration!: boolean

  @Field(() => String, { nullable: true })
  termsAndConditionsUrl!: string

  @Field(() => String, { nullable: true })
  privacyPolicyUrl!: string
}
