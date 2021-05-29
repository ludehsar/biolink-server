import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class UTMParameterInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableUtmParameters?: boolean

  @Field({ nullable: true })
  utmSource?: string

  @Field({ nullable: true })
  utmMedium?: string

  @Field({ nullable: true })
  utmCampaign?: string
}
