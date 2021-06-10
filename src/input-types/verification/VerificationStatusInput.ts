import { IsBoolean, IsNotEmpty } from 'class-validator'
import { VerificationStatus } from '../../enums'
import { InputType, Field } from 'type-graphql'

@InputType()
export class VerificationStatusInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  status!: VerificationStatus

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  verifiedGovernmentId!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  verifiedEmail!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  verifiedPhoneNumber!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  verifiedWorkEmail!: boolean
}
