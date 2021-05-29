import { IsEmail, Matches, IsOptional } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class EmailAndUsernameInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string

  @Field({ nullable: true })
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  @IsOptional()
  username?: string
}
