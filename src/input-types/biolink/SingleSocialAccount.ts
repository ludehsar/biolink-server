import { InputType, Field } from 'type-graphql'
import { IsIn, IsNotEmpty, IsUrl } from 'class-validator'
import { getSupportedSocialIcons } from '../../utilities'

@InputType()
export class SingleSocialAccount {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsIn(getSupportedSocialIcons)
  platform?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsUrl()
  link?: string
}
