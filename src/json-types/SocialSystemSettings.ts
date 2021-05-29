import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SocialSystemSettings {
  @Field(() => String, { nullable: true })
  youtube!: string

  @Field(() => String, { nullable: true })
  facebook!: string

  @Field(() => String, { nullable: true })
  twitter!: string

  @Field(() => String, { nullable: true })
  instagram!: string
}
