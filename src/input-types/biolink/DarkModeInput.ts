import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class DarkModeInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  enableDarkMode?: boolean
}
