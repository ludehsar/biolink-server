import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { InputType, Field, Float } from 'type-graphql'
import { CodeType } from '../../enums'

@InputType()
export class NewCodeInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(CodeType)
  type?: CodeType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  code?: string

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  @IsNumber()
  discount?: number

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  @IsNumber()
  quantity?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDate()
  expireDate?: Date
}
