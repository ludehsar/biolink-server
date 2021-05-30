import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class UTMParameterInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableUtmParameters?: boolean

  @Field({ nullable: true })
  @IsOptional()
  utmSource?: string

  @Field({ nullable: true })
  @IsOptional()
  utmMedium?: string

  @Field({ nullable: true })
  @IsOptional()
  utmCampaign?: string
}
