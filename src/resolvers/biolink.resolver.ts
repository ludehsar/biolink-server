import { IsNotEmpty, Matches, IsInt } from 'class-validator'
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { Biolink } from '../models/entities/Biolink'
import CurrentUser from '../decorators/currentUser'
import { User } from '../models/entities/User'
import { FieldError } from './commonTypes'
import {
  createNewBiolink,
  getBiolinkFromUsername,
  removeBiolinkByUsername,
  updateBiolinkFromUsername,
} from '../services/biolink.service'

@InputType()
export class NewBiolinkInput {
  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username?: string

  @Field()
  @IsNotEmpty()
  @IsInt()
  categoryId?: number
}

@InputType()
export class UpdateBiolinkProfileInput {
  @Field({ nullable: true })
  displayName?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  bio?: string
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
    @Arg('options') options: NewBiolinkInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await createNewBiolink(options, user)
  }

  @Query(() => BiolinkResponse)
  async getBiolinkFromUsername(@Arg('username') username: string): Promise<BiolinkResponse> {
    return await getBiolinkFromUsername(username)
  }

  @Mutation(() => BiolinkResponse)
  async updateBiolinkFromUsername(
    @Arg('username') username: string,
    @Arg('options') options: UpdateBiolinkProfileInput,
    @CurrentUser() user: User
  ): Promise<BiolinkResponse> {
    return await updateBiolinkFromUsername(user, username, options)
  }

  @Mutation(() => Boolean)
  async deleteBiolink(
    @Arg('username') username: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return await removeBiolinkByUsername(username, user)
  }
}
