import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class AdsSystemSettings {
  @Field(() => String, { nullable: true })
  header!: string

  @Field(() => String, { nullable: true })
  footer!: string

  @Field(() => String, { nullable: true })
  biolinkPageHeader!: string

  @Field(() => String, { nullable: true })
  biolinkPageFooter!: string
}
