import { InputType, Field } from 'type-graphql'
import { IsNotEmpty, IsUrl } from 'class-validator'

@InputType()
export class SingleSocialAccount {
  @Field()
  @IsNotEmpty()
  platform?: string

  @Field()
  @IsNotEmpty()
  @IsUrl()
  link?: string
}
