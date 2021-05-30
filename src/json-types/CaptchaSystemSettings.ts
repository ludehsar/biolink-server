import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CaptchaSystemSettings {
  @Field(() => String, { nullable: true })
  captchaType!: string

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnLoginPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnRegisterPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnLostPasswordPage!: boolean

  @Field(() => Boolean, { nullable: true })
  enableCaptchaOnResendActivationPage!: boolean
}
