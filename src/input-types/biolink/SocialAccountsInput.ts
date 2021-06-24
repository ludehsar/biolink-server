import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { SingleSocialAccount } from '../../input-types'
import { SocialAccountStyleType } from '../../enums'

@InputType()
export class SocialAccountsInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableColoredSocialMediaIcons?: boolean

  @Field({ nullable: true, defaultValue: SocialAccountStyleType.Round })
  @IsEnum(SocialAccountStyleType)
  @IsOptional()
  socialAccountStyleType?: SocialAccountStyleType

  @Field(() => [SingleSocialAccount], { nullable: true, defaultValue: [] })
  @IsOptional()
  socialAccounts?: SingleSocialAccount[]
}
