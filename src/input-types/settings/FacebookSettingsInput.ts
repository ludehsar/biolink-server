import { IsBoolean, IsOptional } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class FacebookSettingsInput {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableFacebookLogin!: boolean
}
