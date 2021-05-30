import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional } from 'class-validator'
import { SingleSocialAccount } from './SingleSocialAccount'

@InputType()
export class SocialAccountsInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredSocialMediaIcons?: boolean

  @Field(() => [SingleSocialAccount], { nullable: true, defaultValue: [] })
  @IsOptional()
  socialAccounts?: SingleSocialAccount[]
}
