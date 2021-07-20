import { IsArray, IsBoolean, IsOptional } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class NotificationSettingsInput {
  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsArray()
  @IsOptional()
  emailsToBeNotified!: string[]

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  emailOnNewUser!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  emailOnNewPayment!: boolean
}
