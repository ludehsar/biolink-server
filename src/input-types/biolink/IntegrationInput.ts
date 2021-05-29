import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class IntegrationInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableFacebookPixel?: boolean

  @Field({ nullable: true })
  facebookPixelId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableGoogleAnalytics?: boolean

  @Field({ nullable: true })
  googleAnalyticsCode?: string
}
