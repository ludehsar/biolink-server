import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator'

@InputType()
export class ContactButtonInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showEmail?: boolean

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showPhone?: boolean

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredContactButtons?: boolean
}
