import { InputType, Field, ObjectType } from 'type-graphql'

import { User } from '../../models/entities/User'

@InputType()
export class LoginInput {
  @Field()
  emailOrUsername!: string

  @Field()
  password!: string
}

@InputType()
export class RegisterInput {
  @Field()
  email!: string

  @Field()
  username!: string

  @Field()
  password!: string
}

@ObjectType()
export class FieldError {
  @Field()
  field!: string

  @Field()
  message!: string
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}
