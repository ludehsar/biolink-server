import { IsNotEmpty, IsEmail } from 'class-validator'
import { InputType, Field, ObjectType } from 'type-graphql'

import { Referral } from '../models/entities/Referral'
import { FieldError } from './common.typeDef'

@InputType()
export class ReferredUserInfo {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  referredToEmail!: string

  @Field()
  @IsNotEmpty()
  referredToName!: string
}

@InputType()
export class ReferralInput {
  @Field(() => [ReferredUserInfo], { nullable: true })
  userInfo!: ReferredUserInfo[]

  @Field()
  @IsNotEmpty()
  @IsEmail()
  referredByEmail!: string

  @Field()
  @IsNotEmpty()
  referredByName!: string
}

@ObjectType()
export class ReferralResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [Referral], { nullable: true })
  referrals?: Referral[]
}
