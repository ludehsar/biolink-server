import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsEmail, IsPhoneNumber } from 'class-validator'

@InputType()
export class ContactButtonInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  showEmail?: boolean

  @Field({ nullable: true })
  @IsEmail()
  email?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  showPhone?: boolean

  @Field({ nullable: true })
  @IsPhoneNumber()
  phone?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableColoredContactButtons?: boolean
}
