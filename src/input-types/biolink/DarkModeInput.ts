import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class DarkModeInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableDarkMode?: boolean
}
