import { InputType, Field } from 'type-graphql'
import { IsUrl, IsBoolean, IsOptional, ValidateIf } from 'class-validator'

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
  @ValidateIf((e) => e.customBrandingName !== '')
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  @ValidateIf((e) => e.customBrandingUrl !== '')
  customBrandingUrl?: string
}
