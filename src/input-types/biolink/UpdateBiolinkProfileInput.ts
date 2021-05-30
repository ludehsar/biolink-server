import { InputType, Field } from 'type-graphql'
import { IsInt, IsOptional } from 'class-validator'

@InputType()
export class UpdateBiolinkProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  displayName?: string

  @Field({ nullable: true })
  @IsOptional()
  location?: string

  @Field({ nullable: true })
  @IsOptional()
  bio?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number
}
