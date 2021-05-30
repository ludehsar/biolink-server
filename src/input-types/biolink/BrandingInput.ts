import { InputType, Field } from 'type-graphql'
import { IsUrl, IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class BrandingInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  removeDefaultBranding?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCustomBranding?: boolean

  @Field({ nullable: true })
  @IsOptional()
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  customBrandingUrl?: string
}
