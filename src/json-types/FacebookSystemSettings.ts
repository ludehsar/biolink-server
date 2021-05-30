import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FacebookSystemSettings {
  @Field(() => Boolean, { nullable: true })
  enableFacebookLogin!: boolean
}
