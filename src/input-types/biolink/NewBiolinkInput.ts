import { InputType, Field } from 'type-graphql'
import { IsNotEmpty, Matches } from 'class-validator'

@InputType()
export class NewBiolinkInput {
  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username?: string
}
