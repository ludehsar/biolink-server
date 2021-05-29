import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CaptchaSystemSettings {
  @Field(() => String, { nullable: true })
  captchaType!: string

  @Field(() => String, { nullable: true })
  enableCaptchaOnLoginPage!: string

  @Field(() => String, { nullable: true })
  enableCaptchaOnRegisterPage!: string

  @Field(() => String, { nullable: true })
  enableCaptchaOnLostPasswordPage!: string

  @Field(() => String, { nullable: true })
  enableCaptchaOnResendActivationPage!: string
}
