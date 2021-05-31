import { InputType, Field } from 'type-graphql'
import { IsArray } from 'class-validator'

@InputType()
export class SortedLinksInput {
  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  linkIds?: string[]
}
