import { IsEmail, IsNotEmpty } from 'class-validator'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import CurrentUser from '../decorators/currentUser'
import { Referral } from '../models/entities/Referral'
import { User } from '../models/entities/User'
import { FieldError } from './commonTypes'
import { createReferrals, getReferralsList } from '../services/referral.service'
import { MyContext } from '../MyContext'

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

@Resolver()
export class ReferralResolver {
  @Query(() => ReferralResponse)
  async getReferralsList(@CurrentUser() user: User): Promise<ReferralResponse> {
    return await getReferralsList(user)
  }

  @Mutation(() => ReferralResponse)
  async createReferrals(
    @Arg('referralOptions') referralOptions: ReferralInput,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<ReferralResponse> {
    return await createReferrals(referralOptions, user, context)
  }
}
