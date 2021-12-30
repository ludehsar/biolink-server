import { InputType, Field } from 'type-graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateBiolinkProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  displayName?: string

  @Field({ nullable: true })
  @IsOptional()
  city?: string

  @Field({ nullable: true })
  @IsOptional()
  state?: string

  @Field({ nullable: true })
  @IsOptional()
  country?: string

  @Field({ nullable: true })
  @IsOptional()
  bio?: string

  @Field({ nullable: true })
  @IsOptional()
  categoryId?: string
}
