import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { PremiumUsernameType } from '../../enums'

@InputType()
export class NewUsernameInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  username?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(PremiumUsernameType)
  premiumType?: PremiumUsernameType

  @Field(() => String, { nullable: true })
  @IsOptional()
  ownerId?: string
}
