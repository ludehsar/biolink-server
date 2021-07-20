import { Field, InputType } from 'type-graphql'

@InputType()
export class AdsSettingsInput {
  @Field(() => String, { nullable: true })
  header?: string

  @Field(() => String, { nullable: true })
  footer?: string

  @Field(() => String, { nullable: true })
  biolinkPageHeader?: string

  @Field(() => String, { nullable: true })
  biolinkPageFooter?: string
}
