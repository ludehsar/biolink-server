import { Field, InputType } from 'type-graphql'

@InputType()
export class RoleSettingsInput {
  @Field(() => String, { nullable: true })
  resource!: string

  @Field(() => Boolean, { defaultValue: false })
  canShowList!: boolean

  @Field(() => Boolean, { defaultValue: false })
  canShow!: boolean

  @Field(() => Boolean, { defaultValue: false })
  canCreate!: boolean

  @Field(() => Boolean, { defaultValue: false })
  canEdit!: boolean

  @Field(() => Boolean, { defaultValue: false })
  canDelete!: boolean
}
