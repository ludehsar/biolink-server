import { IsNotEmpty, IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { ReferredUserInfo } from '../../input-types'

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
