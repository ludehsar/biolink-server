import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class SEOInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  blockSearchEngineIndexing?: boolean

  @Field({ nullable: true })
  @IsOptional()
  pageTitle?: string

  @Field({ nullable: true })
  @IsOptional()
  metaDescription?: string

  @Field({ nullable: true })
  @IsOptional()
  opengraphImageUrl?: string
}
