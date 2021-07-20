import { IsBoolean, IsOptional } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class LinkSettingsInput {
  @Field(() => String, { nullable: true })
  branding?: string

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enableLinkShortenerSystem?: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enablePhishtank!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enableGoogleSafeBrowsing!: boolean
}
