import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class EmailSystemSettings {
  @Field(() => String, { nullable: true })
  fromName!: string
}
