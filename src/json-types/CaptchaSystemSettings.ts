import { Field, ObjectType } from 'type-graphql'
import { CaptchaType } from '../enums'

@ObjectType()
export class CaptchaSystemSettings {
  @Field(() => String, { nullable: true })
  captchaType!: CaptchaType

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnLoginPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnRegisterPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnLostPasswordPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnResendActivationPage!: boolean
}
