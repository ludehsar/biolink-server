import { InputType, Field } from 'type-graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class NewCategoryInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  categoryName?: string
}
