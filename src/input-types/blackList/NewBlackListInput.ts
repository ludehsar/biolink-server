import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { BlacklistType } from '../../enums'

@InputType()
export class NewBlackListInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(BlacklistType)
  blacklistType?: BlacklistType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  keyword?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  reason?: string
}
