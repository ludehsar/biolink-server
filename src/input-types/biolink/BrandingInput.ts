import { InputType, Field } from 'type-graphql'
import { IsUrl, IsBoolean } from 'class-validator'

@InputType()
export class BrandingInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  removeDefaultBranding?: boolean

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableCustomBranding?: boolean

  @Field({ nullable: true })
  customBrandingName?: string

  @Field({ nullable: true })
  @IsUrl()
  customBrandingUrl?: string
}
