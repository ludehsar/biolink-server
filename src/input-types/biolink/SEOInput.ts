import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class SEOInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  blockSearchEngineIndexing?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.pageTitle !== '')
  pageTitle?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.metaDescription !== '')
  metaDescription?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.opengraphImageUrl !== '')
  opengraphImageUrl?: string
}
