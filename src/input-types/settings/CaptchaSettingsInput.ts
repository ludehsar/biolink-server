import { IsBoolean, IsOptional } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { CaptchaType } from '../../enums'

@InputType()
export class CaptchaSettingsInput {
  @Field(() => String, { nullable: true, defaultValue: CaptchaType.Basic })
  captchaType!: CaptchaType

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCaptchaOnLoginPage!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCaptchaOnRegisterPage!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCaptchaOnLostPasswordPage!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableCaptchaOnResendActivationPage!: boolean
}
