import { InputType, Field } from 'type-graphql'
import { IsInt, IsNumber, IsOptional } from 'class-validator'

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
  @IsNumber()
  latitude?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number

  @Field({ nullable: true })
  @IsOptional()
  bio?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number
}
