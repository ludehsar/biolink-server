import { InputType, Field } from 'type-graphql'
import { IsInt } from 'class-validator'

@InputType()
export class UpdateBiolinkProfileInput {
  @Field({ nullable: true })
  displayName?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  @IsInt()
  categoryId?: number
}
