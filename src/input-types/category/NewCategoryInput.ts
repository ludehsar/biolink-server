import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class NewCategoryInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  categoryName?: string

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean
}
