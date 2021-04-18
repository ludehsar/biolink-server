import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BusinessSystemSettings {
  @Field(() => String, { nullable: true })
  enableInvoice!: string

  @Field(() => String, { nullable: true })
  invoiceNrPrefix!: string

  @Field(() => String, { nullable: true })
  name!: string

  @Field(() => String, { nullable: true })
  address!: string

  @Field(() => String, { nullable: true })
  city!: string

  @Field(() => String, { nullable: true })
  country!: string

  @Field(() => String, { nullable: true })
  zipCode!: string

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  phone!: string

  @Field(() => String, { nullable: true })
  taxType!: string

  @Field(() => String, { nullable: true })
  taxId!: string
}
