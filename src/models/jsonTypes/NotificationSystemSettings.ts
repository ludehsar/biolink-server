import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class NotificationSystemSettings {
  @Field(() => [String], { nullable: true })
  emailsToBeNotified!: string[]

  @Field(() => String, { nullable: true })
  emailOnNewUser!: string

  @Field(() => String, { nullable: true })
  emailOnNewPayment!: string

  @Field(() => String, { nullable: true })
  emailOnNewCustomDomain!: string
}
