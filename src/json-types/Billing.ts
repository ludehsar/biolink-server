import { Field, ObjectType } from 'type-graphql'

import { BillingType } from '../enums'

@ObjectType()
export class Billing {
  @Field(() => String, { nullable: true })
  type!: BillingType

  @Field(() => String, { nullable: true })
  name!: string

  @Field(() => String, { nullable: true })
  address1!: string

  @Field(() => String, { nullable: true })
  address2!: string

  @Field(() => String, { nullable: true })
  city!: string

  @Field(() => String, { nullable: true })
  state!: string

  @Field(() => String, { nullable: true })
  country!: string

  @Field(() => String, { nullable: true })
  zip!: string

  @Field(() => String, { nullable: true })
  phone!: string
}
