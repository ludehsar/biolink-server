import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class IntegrationInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableFacebookPixel?: boolean

  @Field({ nullable: true })
  @IsOptional()
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableGoogleAnalytics?: boolean

  @Field({ nullable: true })
  @IsOptional()
  googleAnalyticsCode?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableEmailCapture?: boolean

  @Field({ nullable: true })
  @IsOptional()
  emailCaptureId?: string
}
