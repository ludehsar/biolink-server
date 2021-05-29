import { BillingType } from 'enums'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Billing {
  @Field(() => String, { nullable: true })
  type!: BillingType

  @Field(() => String, { nullable: true })
  name!: string

  @Field(() => String, { nullable: true })
  address!: string

  @Field(() => String, { nullable: true })
  city!: string

  @Field(() => String, { nullable: true })
  country!: string

  @Field(() => String, { nullable: true })
  zip!: string

  @Field(() => String, { nullable: true })
  phone!: string
}
