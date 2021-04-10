import { InputType, Field, ObjectType } from 'type-graphql'

import { User } from '../../models/entities/User'

@InputType()
export class LoginInput {
  @Field()
  email: string = ''

  @Field()
  password: string = ''
}

@ObjectType()
export class FieldError {
  @Field()
  field: string = ''

  @Field()
  message: string = ''
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}
