import { IsNotEmpty, Matches, IsInt } from 'class-validator'
import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'

import { Biolink } from '../models/entities/Biolink'
import CurrentUser from '../decorators/currentUser'
import { User } from '../models/entities/User'
import { FieldError } from './commonTypes'
import { createNewBiolink } from '../services/biolink.service'

@InputType()
export class BiolinkInput {
  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username!: string

  @Field()
  @IsNotEmpty()
  @IsInt()
  categoryId!: number
}

@ObjectType()
export class BiolinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Biolink, { nullable: true })
  biolink?: Biolink
}

@Resolver()
export class BiolinkResolver {
  @Mutation(() => BiolinkResponse)
  async createNewBiolink(
    @Arg('options') options: BiolinkInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createNewBiolink(options, user)
  }
}
