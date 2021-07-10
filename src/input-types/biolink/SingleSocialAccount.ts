import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsIn, IsNotEmpty, IsUrl } from 'class-validator'
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

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @IsNotEmpty()
  @IsBoolean()
  featured?: boolean
}
