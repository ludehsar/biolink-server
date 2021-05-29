import { IsNotEmpty, IsEmail } from 'class-validator'
import { ReferredUserInfo } from 'input-types'
import { InputType, Field } from 'type-graphql'

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
