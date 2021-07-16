import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class IntegrationInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableFacebookPixel?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.facebookPixelId !== '')
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableGoogleAnalytics?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.googleAnalyticsCode !== '')
  googleAnalyticsCode?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableEmailCapture?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.emailCaptureId !== '')
  emailCaptureId?: string
}
