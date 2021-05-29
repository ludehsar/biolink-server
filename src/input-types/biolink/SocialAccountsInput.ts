import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'
import { SingleSocialAccount } from './SingleSocialAccount'

@InputType()
export class SocialAccountsInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableColoredSocialMediaIcons?: boolean

  @Field(() => [SingleSocialAccount], { nullable: true, defaultValue: [] })
  socialAccounts?: SingleSocialAccount[]
}
