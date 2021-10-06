import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class DirectorySearchResponse {
  @Field(() => [String], { nullable: true })
  results?: string[]
}
