import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FacebookSystemSettings {
  @Field(() => String, { nullable: true })
  enableFacebookLogin!: string
}
