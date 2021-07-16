import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator'

@InputType()
export class ContactButtonInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showEmail?: boolean

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  email?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  showPhone?: boolean

  @Field({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  @ValidateIf((e) => e.customBrandingUrl !== '')
  phone?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredContactButtons?: boolean
}
