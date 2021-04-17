import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class NotificationSystemSettings {
  @Field(() => [String], { nullable: true })
  emailsToBeNotified!: string[]

  @Field(() => Boolean, { nullable: true })
  emailOnNewUser!: boolean

  @Field(() => Boolean, { nullable: true })
  emailOnNewPayment!: boolean

  @Field(() => Boolean, { nullable: true })
  emailOnNewCustomDomain!: boolean
}
