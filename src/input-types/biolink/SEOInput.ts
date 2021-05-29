import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class SEOInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  blockSearchEngineIndexing?: boolean

  @Field({ nullable: true })
  pageTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field({ nullable: true })
  opengraphImageUrl?: string
}
